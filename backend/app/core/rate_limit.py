import time
from collections import defaultdict
from typing import Dict, List

from fastapi import HTTPException, Request, status


class SlidingWindowRateLimiter:
    """In-memory sliding-window rate limiter."""

    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, key: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds

        # Clean old timestamps
        self.requests[key] = [t for t in self.requests[key] if t > cutoff]

        if len(self.requests[key]) >= self.max_requests:
            return False

        self.requests[key].append(now)
        return True


# Global rate limiters
auth_limiter = SlidingWindowRateLimiter(max_requests=10, window_seconds=60)  # 10 req/min for auth
api_limiter = SlidingWindowRateLimiter(max_requests=120, window_seconds=60)  # 120 req/min for general API


async def rate_limit_auth(request: Request) -> None:
    client_ip = request.client.host if request.client else "unknown"
    if not auth_limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many authentication attempts. Please slow down.",
        )
