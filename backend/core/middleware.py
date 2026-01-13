import time
from loguru import logger
from fastapi import Request

# For Django Middleware
class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        # Process request
        response = self.get_response(request)
        
        process_time = time.time() - start_time
        
        log_data = {
            "method": request.method,
            "path": request.path,
            "status_code": response.status_code,
            "ip": request.META.get('REMOTE_ADDR'),
            "duration": f"{process_time:.4f}s"
        }
        
        if 400 <= response.status_code < 500:
            logger.warning(f"Request: {log_data}")
        elif response.status_code >= 500:
            logger.error(f"Server Error: {log_data}")
        else:
            logger.info(f"Access: {log_data}")
            
        return response

# For FastAPI Middleware, we can add it in asgi.py or here as a function
async def log_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s"
    )
    return response
