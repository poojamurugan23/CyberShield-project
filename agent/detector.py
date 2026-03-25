"""
detector.py — Rule-based anomaly detection engine.
Reliability modifications: memory-capped execution context to prevent memory leak.
"""

import logging
import datetime
from collections import Counter
from dataclasses import dataclass, field
from typing import List

from agent.monitor import Snapshot
from agent.config import (
    SUSPICIOUS_PROCESSES,
    CONNECTION_THRESHOLD,
    SUSPICIOUS_PROCESS_THRESHOLD,
)

logger = logging.getLogger("detector")

@dataclass
class ThreatAlert:
    rule: str
    severity: str
    description: str
    details: dict
    timestamp: str = field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
    )

# Bounded history limits memory footprint.
_process_history: List[List[str]] = []
_simulated_login_failures: int = 0


def simulate_login_failure():
    global _simulated_login_failures
    _simulated_login_failures += 1
    logger.info(f"Simulated login failure. Current count: {_simulated_login_failures}")


def analyse(snapshot: Snapshot) -> List[ThreatAlert]:
    alerts: List[ThreatAlert] = []

    try:
        # Rule 1: Suspicious process
        _process_history.append(snapshot.process_names)
        if len(_process_history) > 10:
            _process_history.pop(0)

        flat = [n for cycle in _process_history for n in cycle]
        counts = Counter(flat)
        for proc in SUSPICIOUS_PROCESSES:
            count = counts.get(proc, 0)
            if count >= SUSPICIOUS_PROCESS_THRESHOLD:
                alerts.append(ThreatAlert(
                    rule="SUSPICIOUS_PROCESS_REPEAT",
                    severity="HIGH",
                    description=f"Suspicious process '{proc}' detected {count} times.",
                    details={"process": proc, "count": count},
                ))

        # Rule 2: High connection count
        if snapshot.connections > CONNECTION_THRESHOLD:
            alerts.append(ThreatAlert(
                rule="HIGH_CONNECTION_COUNT",
                severity="MEDIUM",
                description=f"Connections ({snapshot.connections}) exceed threshold ({CONNECTION_THRESHOLD}).",
                details={"connections": snapshot.connections, "threshold": CONNECTION_THRESHOLD},
            ))

        # Rule 3: Simulated multiple login failures
        global _simulated_login_failures
        if _simulated_login_failures >= 3:
            alerts.append(ThreatAlert(
                rule="MULTIPLE_LOGIN_FAILURES",
                severity="CRITICAL",
                description=f"{_simulated_login_failures} failed login attempts detected.",
                details={"attempts": _simulated_login_failures},
            ))
            _simulated_login_failures = 0

    except Exception as e:
        logger.error(f"Detector analysis failed: {e}")

    return alerts
