"""
ASGI config for the project.

It exposes the ASGI callable as a module-level variable named ``application``.
"""

import os
import sys
from django.core.asgi import get_asgi_application
from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Initialize Django ASGI application
try:
    django_asgi_app = get_asgi_application()
except Exception as e:
    logger.error(f"Failed to load Django ASGI app: {e}")
    sys.exit(1)

# Initialize FastAPI
fastapi_app = FastAPI(title="Flight Delay Insurance API")

# Add Access Logging Middleware (Apache2 format)
try:
    from middleware import AccessLogMiddleware
    fastapi_app.add_middleware(AccessLogMiddleware)
    logger.info("✅ Access logging middleware enabled")
except Exception as e:
    logger.warning(f"Could not load logging middleware: {e}")

# Configure CORS for FastAPI
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@fastapi_app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Flight Delay Insurance Backend"}

# Mount Django app under / (it will handle /admin, etc.)
# Note: FastAPI routes take precedence if they don't match, it falls through?
# Actually WSGIMiddleware is a catch-all usually, but we want FastAPI to handle /api/*
# and Django to handle /admin/* and others.
# The standard pattern is: Main app is FastAPI. Mount Django as sub-app OR fallback.
# Here we will Mount Django at /django_mount and perhaps use it for Admin.
# OR we use the pattern: 
# app = FastAPI()
# app.mount("/", WSGIMiddleware(django_app))
# But this might mask FastAPI routes.
# Better:
# app = FastAPI()
# app.include_router(...)
# app.mount("/django", WSGIMiddleware(django_app)) -> accessible at /django/admin
# But Django Admin expects to be at root usually or needs careful url config.
# Let's try mounting Django at root BUT after FastAPI routes are defined.
# If we define /api routes first, they are matched first.

from api.router import api_router
fastapi_app.include_router(api_router, prefix="/api")

# GraphQL
from strawberry.fastapi import GraphQLRouter
from api.schema import schema
graphql_app = GraphQLRouter(schema)
fastapi_app.include_router(graphql_app, prefix="/graphql")

# Mount Django
fastapi_app.mount("/", django_asgi_app)

app = fastapi_app
