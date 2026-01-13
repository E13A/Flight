from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
import jwt
import datetime
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from core.models import AppUser
from asgiref.sync import sync_to_async

router = APIRouter()

# Schemas
class LoginRequest(BaseModel):
    username: str # Can be email
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    full_name: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None

# JWT Config (Using settings.SECRET_KEY)
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=60)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def get_app_user_by_email(email: str):
    """Get AppUser by email, returns None if not found"""
    try:
        return AppUser.objects.get(email=email)
    except AppUser.DoesNotExist:
        return None

# Endpoints
@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    # Try to authenticate with Django
    user = authenticate(username=request.username, password=request.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get the AppUser to include the correct user_id
    app_user = get_app_user_by_email(user.email)
    app_user_id = app_user.user_id if app_user else user.id
    
    access_token = create_access_token({
        "sub": user.username, 
        "user_id": app_user_id,  # Use AppUser's ID
        "django_user_id": user.id
    })
    refresh_token = create_refresh_token({
        "sub": user.username, 
        "user_id": app_user_id,
        "django_user_id": user.id
    })
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token, 
        "token_type": "bearer"
    }

@router.post("/register", response_model=TokenResponse)
def register(request: RegisterRequest):
    # Check if user exists
    if User.objects.filter(username=request.username).exists():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    if User.objects.filter(email=request.email).exists():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create Django User
    user = User.objects.create_user(
        username=request.username,
        email=request.email,
        password=request.password
    )
    
    # Create AppUser (Business Entity)
    try:
        app_user = AppUser.objects.create(
            name=request.full_name,
            email=request.email,
            phone=request.phone
        )
    except Exception as e:
        user.delete()
        raise HTTPException(status_code=500, detail=f"Failed to create user profile: {str(e)}")

    # Use the AppUser's user_id in the token
    access_token = create_access_token({
        "sub": user.username, 
        "user_id": app_user.user_id,  # Use AppUser's ID
        "django_user_id": user.id
    })
    refresh_token = create_refresh_token({
        "sub": user.username, 
        "user_id": app_user.user_id,
        "django_user_id": user.id
    })
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token, 
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "refresh":
             raise HTTPException(status_code=401, detail="Invalid token type")
        
        username = payload.get("sub")
        user_id = payload.get("user_id")
        django_user_id = payload.get("django_user_id", user_id)
        
        # Verify user exists
        if not User.objects.filter(id=django_user_id).exists():
            raise HTTPException(status_code=401, detail="User not found")
            
        new_access_token = create_access_token({
            "sub": username, 
            "user_id": user_id,
            "django_user_id": django_user_id
        })
        new_refresh_token = create_refresh_token({
            "sub": username, 
            "user_id": user_id,
            "django_user_id": django_user_id
        })
        
        return {
            "access_token": new_access_token, 
            "refresh_token": new_refresh_token, 
            "token_type": "bearer"
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@router.get("/me", response_model=UserResponse)
def get_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        user_id = payload.get("user_id")  # This is now AppUser's ID
        django_user_id = payload.get("django_user_id", user_id)
        
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Get Django user for username/email
    django_user = User.objects.filter(id=django_user_id).first()
    if django_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get AppUser for the full name
    app_user = get_app_user_by_email(django_user.email)
    full_name = app_user.name if app_user else django_user.get_full_name() or django_user.username
    
    return {
        "id": user_id,  # Return AppUser's ID for use in API calls
        "username": django_user.username,
        "email": django_user.email,
        "full_name": full_name
    }

