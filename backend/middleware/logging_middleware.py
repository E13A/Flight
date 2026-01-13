"""
Apache2-style Access Logging Middleware for FastAPI
Logs all HTTP requests in Apache Combined Log Format
"""
import time
from datetime import datetime
from pathlib import Path
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import logging
import os

# Create logs directory
LOGS_DIR = Path(__file__).parent.parent.parent / "security" / "logs"
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Configure Apache-style access logger
access_logger = logging.getLogger("access")
access_logger.setLevel(logging.INFO)

# Access log handler (Apache Combined Log Format)
access_handler = logging.FileHandler(LOGS_DIR / "access.log", encoding='utf-8')
access_formatter = logging.Formatter(
    '%(remote_addr)s - - [%(asctime)s] "%(method)s %(path)s %(http_version)s" '
    '%(status_code)s %(response_size)s "%(referer)s" "%(user_agent)s"',
    datefmt='%d/%b/%Y:%H:%M:%S %z'
)
access_handler.setFormatter(access_formatter)
access_logger.addHandler(access_handler)

# Error logger
error_logger = logging.getLogger("error")
error_logger.setLevel(logging.ERROR)
error_handler = logging.FileHandler(LOGS_DIR / "error.log", encoding='utf-8')
error_formatter = logging.Formatter(
    '[%(asctime)s] [%(levelname)s] %(message)s',
    datefmt='%d/%b/%Y:%H:%M:%S %z'
)
error_handler.setFormatter(error_formatter)
error_logger.addHandler(error_handler)

# Security logger
security_logger = logging.getLogger("security")
security_logger.setLevel(logging.WARNING)
security_handler = logging.FileHandler(LOGS_DIR / "security.log", encoding='utf-8')
security_formatter = logging.Formatter(
    '[%(asctime)s] [SECURITY] %(remote_addr)s - %(message)s',
    datefmt='%d/%b/%Y:%H:%M:%S %z'
)
security_handler.setFormatter(security_formatter)
security_logger.addHandler(security_handler)


class AccessLogMiddleware(BaseHTTPMiddleware):
    """Middleware to log all HTTP requests in Apache format"""
    
    async def dispatch(self, request: Request, call_next):
        # Capture request start time
        start_time = time.time()
        
        # Get request details
        remote_addr = request.client.host if request.client else "unknown"
        method = request.method
        path = request.url.path
        if request.url.query:
            path += f"?{request.url.query}"
        http_version = f"HTTP/{request.scope.get('http_version', '1.1')}"
        referer = request.headers.get("referer", "-")
        user_agent = request.headers.get("user-agent", "-")
        
        # Process request
        try:
            response = await call_next(request)
            status_code = response.status_code
            
            # Calculate response size (approximate)
            response_size = response.headers.get("content-length", "-")
            
            # Log to access log
            access_logger.info(
                "",
                extra={
                    "remote_addr": remote_addr,
                    "method": method,
                    "path": path,
                    "http_version": http_version,
                    "status_code": status_code,
                    "response_size": response_size,
                    "referer": referer,
                    "user_agent": user_agent
                }
            )
            
            # Log errors to error log
            if status_code >= 400:
                error_logger.error(
                    f"{remote_addr} - {method} {path} - Status {status_code}"
                )
            
            # Log security events
            if status_code == 401 or status_code == 403:
                security_logger.warning(
                    f"Access denied - {method} {path}",
                    extra={"remote_addr": remote_addr}
                )
            
            # Log suspicious activity (SQL injection attempts, XSS, etc.)
            suspicious_patterns = ["'", "\"", "<script", "union select", "drop table", "../"]
            if any(pattern.lower() in path.lower() for pattern in suspicious_patterns):
                security_logger.warning(
                    f"Suspicious request pattern detected - {method} {path}",
                    extra={"remote_addr": remote_addr}
                )
            
            return response
            
        except Exception as e:
            # Log exceptions
            error_logger.error(
                f"Exception during request: {remote_addr} - {method} {path} - {str(e)}"
            )
            raise


def log_blockchain_transaction(transaction_type: str, user_id: int, amount: float, tx_hash: str, status: str):
    """Log blockchain transactions to dedicated log file"""
    blockchain_logger = logging.getLogger("blockchain")
    blockchain_logger.setLevel(logging.INFO)
    
    if not blockchain_logger.handlers:
        handler = logging.FileHandler(LOGS_DIR / "blockchain.log", encoding='utf-8')
        formatter = logging.Formatter(
            '[%(asctime)s] [BLOCKCHAIN] %(message)s',
            datefmt='%d/%b/%Y:%H:%M:%S %z'
        )
        handler.setFormatter(formatter)
        blockchain_logger.addHandler(handler)
    
    blockchain_logger.info(
        f"Type={transaction_type} User={user_id} Amount=${amount} "
        f"TxHash={tx_hash} Status={status}"
    )


def log_security_event(event_type: str, remote_addr: str, details: str):
    """Log security-specific events"""
    security_logger.warning(
        f"[{event_type}] {details}",
        extra={"remote_addr": remote_addr}
    )
