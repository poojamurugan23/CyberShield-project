"""
config.py — Centralised configuration loader.
Combines .env (for secrets) and config.json (for tunables).
Ensures robustness and cross-platform logging.
"""

import os
import json
import logging
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Paths ──
ENV_PATH = BASE_DIR / ".env"
CONFIG_PATH = BASE_DIR / "config.json"
LOGS_DIR = BASE_DIR / "logs"
EVIDENCE_DIR = BASE_DIR / "evidence"
CONSENT_FILE = BASE_DIR / "consent.json"
SYSTEM_LOG_FILE = LOGS_DIR / "agent.log"

LOGS_DIR.mkdir(exist_ok=True)
EVIDENCE_DIR.mkdir(exist_ok=True)

# ── Logging Setup ──
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler(SYSTEM_LOG_FILE, encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("config")

load_dotenv(ENV_PATH)

# ── Secrets (.env) ──
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
EMAIL_USER = os.getenv("SMTP_USER", "")
EMAIL_PASS = os.getenv("SMTP_PASS", "")
ALERT_RECIPIENT = os.getenv("ALERT_RECIPIENT", "")

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000/api")
DASHBOARD_URL = os.getenv("DASHBOARD_URL", "http://localhost:3000/dashboard")

# ── Tunables (config.json) ──
DEFAULT_CONFIG = {
    "collection_interval_sec": 12,
    "log_rotation_minutes": 30,
    "connection_threshold": 500,
    "suspicious_process_threshold": 3,
    "suspicious_processes": [
        "mimikatz", "lazagne", "keylogger", "nmap", "wireshark",
        "metasploit", "hydra", "john", "hashcat", "netcat"
    ]
}

def load_config() -> dict:
    if not CONFIG_PATH.exists():
        try:
            CONFIG_PATH.write_text(json.dumps(DEFAULT_CONFIG, indent=4), encoding="utf-8")
            logger.info(f"Created default config.json at {CONFIG_PATH}")
        except Exception as e:
            logger.error(f"Failed to create config.json: {e}")
            return DEFAULT_CONFIG
    try:
        return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    except Exception as e:
        logger.error(f"Failed to load config.json (using defaults): {e}")
        return DEFAULT_CONFIG

_cfg = load_config()

COLLECTION_INTERVAL = _cfg.get("collection_interval_sec", 12)
LOG_ROTATION_MINUTES = _cfg.get("log_rotation_minutes", 30)
CONNECTION_THRESHOLD = _cfg.get("connection_threshold", 500)
SUSPICIOUS_PROCESS_THRESHOLD = _cfg.get("suspicious_process_threshold", 3)
SUSPICIOUS_PROCESSES = _cfg.get("suspicious_processes", DEFAULT_CONFIG["suspicious_processes"])
