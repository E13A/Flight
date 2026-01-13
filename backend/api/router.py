from fastapi import APIRouter
from api.endpoints import flights, bookings, policies

api_router = APIRouter()

api_router.include_router(flights.router, prefix="/flights", tags=["flights"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(policies.router, prefix="/policies", tags=["policies"])
from api.endpoints import auth
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
