"""
logger.py — CSV logging with time-based rotation.
Optimized and thread-safe error handling.
"""

import csv
import time
import shutil
import logging
import datetime
from pathlib import Path

from agent.config import LOGS_DIR, LOG_ROTATION_MINUTES
from agent.monitor import Snapshot

logger = logging.getLogger("csv_logger")

TEMP_LOG = LOGS_DIR / "temp_activity.csv"

CSV_FIELDS = [
    "timestamp", "process_count", "top_processes",
    "connection_count", "public_ip",
    "city", "region", "country",
]

_rotation_start: datetime.datetime | None = None
MAX_RETRIES = 3
RETRY_DELAY = 0.5


def _ensure_header():
    try:
        if not TEMP_LOG.exists() or TEMP_LOG.stat().st_size == 0:
            with open(TEMP_LOG, "w", newline="", encoding="utf-8") as f:
                csv.DictWriter(f, fieldnames=CSV_FIELDS).writeheader()
    except Exception as e:
        logger.error(f"Failed to write CSV header: {e}")


def write_snapshot(snap: Snapshot) -> Path:
    _ensure_header()
    for attempt in range(MAX_RETRIES):
        try:
            with open(TEMP_LOG, "a", newline="", encoding="utf-8") as f:
                csv.DictWriter(f, fieldnames=CSV_FIELDS).writerow(snap.to_flat_row())
            return TEMP_LOG
        except (PermissionError, IOError) as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
            else:
                logger.error(f"CSV write failed after {MAX_RETRIES} retries. Error: {e}")
        except Exception as e:
            logger.error(f"Unexpected error writing to CSV: {e}")
            break
    return TEMP_LOG


def should_rotate() -> bool:
    global _rotation_start
    try:
        now = datetime.datetime.now(datetime.timezone.utc)
        if _rotation_start is None:
            _rotation_start = now
            return False
        elapsed = (now - _rotation_start).total_seconds() / 60
        return elapsed >= LOG_ROTATION_MINUTES
    except Exception as e:
        logger.error(f"Error checking log rotation: {e}")
        return False


def rotate_log() -> Path | None:
    global _rotation_start
    if not TEMP_LOG.exists():
        return None

    try:
        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        archive = LOGS_DIR / f"activity_{ts}.csv"
        shutil.copy2(TEMP_LOG, archive)

        with open(TEMP_LOG, "w", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=CSV_FIELDS).writeheader()

        _rotation_start = datetime.datetime.now(datetime.timezone.utc)
        logger.info(f"Log rotated to {archive.name}")
        return archive
    except Exception as e:
        logger.error(f"Log rotation failed: {e}")
        return None


def get_current_log() -> Path:
    _ensure_header()
    return TEMP_LOG
