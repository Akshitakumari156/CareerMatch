import asyncio

from app.core.config import settings
from app.core.logging import logger, setup_logging


async def run_worker() -> None:
    setup_logging(settings.LOG_LEVEL)
    logger.info("CareerMatch background worker initialized.")
    # Scheduled ingestion will be hooked here in Milestone M2
    try:
        while True:
            await asyncio.sleep(3600)
    except (asyncio.CancelledError, KeyboardInterrupt):
        logger.info("Worker stopped.")


if __name__ == "__main__":
    asyncio.run(run_worker())
