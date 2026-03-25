"""
evidence.py — Evidence packaging on anomaly detection.
Automates securing of telemetry, metadata, and user-provided critical documents.
"""

import json
import logging
import shutil
import datetime
from pathlib import Path
from typing import List

from PIL import ImageGrab

from agent.config import EVIDENCE_DIR
from agent.logger import get_current_log
from agent.hasher import write_checksums
from agent.detector import ThreatAlert

logger = logging.getLogger("evidence")


def _create_incident_dir() -> Path:
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    incident_dir = EVIDENCE_DIR / f"incident_{ts}"
    try:
        incident_dir.mkdir(parents=True, exist_ok=True)
    except Exception as e:
        logger.error(f"Could not create incident directory {incident_dir}: {e}")
    return incident_dir


def capture_screenshot(dest_dir: Path) -> Path:
    screenshot_path = dest_dir / "screenshot.png"
    try:
        img = ImageGrab.grab()
        img.save(screenshot_path)
    except Exception as e:
        logger.warning(f"Screenshot capture failed (no display?): {e}")
        try:
            screenshot_path.write_text(f"[Screenshot unavailable: {e}]", encoding="utf-8")
        except Exception:
            pass
    return screenshot_path


def move_logs(dest_dir: Path) -> Path | None:
    try:
        src = get_current_log()
        dest = dest_dir / "activity_log.csv"
        if src.exists():
            shutil.copy2(src, dest)
            return dest
    except Exception as e:
        logger.error(f"Failed to copy activity log: {e}")
    return None


def copy_critical_files(dest_dir: Path, files: List[Path]):
    """Copy critical user-provided files into the evidence vault to secure them."""
    if not files:
        return
    critical_dir = dest_dir / "protected_documents"
    try:
        critical_dir.mkdir(exist_ok=True)
        for f in files:
            if f.exists() and f.is_file():
                try:
                    shutil.copy2(f, critical_dir / f.name)
                except Exception as ex:
                    logger.error(f"Failed to protect file {f.name}: {ex}")
    except Exception as e:
        logger.error(f"Failed to create protected documents directory: {e}")


def generate_metadata(dest_dir: Path, alerts: List[ThreatAlert], snapshot_data: dict) -> Path:
    meta_path = dest_dir / "metadata.json"
    try:
        meta = {
            "incident_id": dest_dir.name,
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "alert_count": len(alerts),
            "alerts": [
                {
                    "rule": a.rule,
                    "severity": a.severity,
                    "description": a.description,
                    "timestamp": a.timestamp,
                }
                for a in alerts
            ],
            "snapshot_summary": snapshot_data,
            "integrity": "sha256_checksums_attached",
        }
        meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
    except Exception as e:
        logger.error(f"Failed to write metadata: {e}")
    return meta_path


def package_evidence(alerts: List[ThreatAlert], snapshot_data: dict, selected_files: List[Path] = None) -> Path:
    """
    1. Allocate directory
    2. Screenshots, logs, critical documents
    3. Metadata 
    4. Hasher secures the vault
    """
    incident_dir = _create_incident_dir()

    capture_screenshot(incident_dir)
    move_logs(incident_dir)

    if selected_files:
        copy_critical_files(incident_dir, selected_files)

    generate_metadata(incident_dir, alerts, snapshot_data)
    
    # Secure everything (including copied user files)
    write_checksums(incident_dir)

    logger.info(f"Evidence packaged and secured at: {incident_dir}")
    return incident_dir
