"""
monitor.py — System telemetry collection.
Performance optimized. Limits memory footprint by avoiding large unused objects.
"""

import logging
import datetime
from dataclasses import dataclass, field
from typing import List, Tuple, Dict

import psutil
import httpx

logger = logging.getLogger("monitor")


@dataclass
class Snapshot:
    timestamp: str
    processes: List[dict]
    connections: int
    public_ip: str
    city: str = ""
    region: str = ""
    country: str = ""
    process_names: List[str] = field(default_factory=list)

    def to_flat_row(self) -> dict:
        return {
            "timestamp": self.timestamp,
            "process_count": len(self.processes),
            "top_processes": "; ".join(self.process_names[:15]),
            "connection_count": self.connections,
            "public_ip": self.public_ip,
            "city": self.city,
            "region": self.region,
            "country": self.country,
        }


def collect_processes() -> Tuple[List[dict], List[str]]:
    procs = []
    names = []
    try:
        # Optimized: fetch only necessary fields
        for p in psutil.process_iter(["pid", "name"]):
            try:
                info = p.info
                procs.append({"pid": info["pid"], "name": info["name"]})
                if info["name"]:
                    names.append(info["name"].lower())
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
    except Exception as e:
        logger.error(f"Error enumerating processes: {e}")
    return procs, names


def collect_connections() -> int:
    try:
        # Performance: fast length calculation avoids keeping large net structure in memory
        return len(psutil.net_connections(kind="inet"))
    except (psutil.AccessDenied, Exception) as e:
        logger.warning(f"Could not read network connections: {e}")
        return -1


def collect_geo_data() -> Dict[str, str]:
    fallback = {"ip": "unavailable", "city": "N/A", "region": "N/A", "country": "N/A"}
    try:
        with httpx.Client(timeout=4.0) as client:
            resp = client.get("http://ip-api.com/json/")
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == "success":
                    return {
                        "ip": data.get("query", "unavailable"),
                        "city": data.get("city", "Unknown"),
                        "region": data.get("regionName", "Unknown"),
                        "country": data.get("country", "Unknown"),
                    }
    except Exception as e:
        logger.debug(f"ip-api.com lookup failed: {e}")

    try:
        with httpx.Client(timeout=2.0) as client:
            resp = client.get("https://api.ipify.org")
            if resp.status_code == 200:
                fallback["ip"] = resp.text.strip()
    except Exception as e:
        logger.debug(f"ipify fallback failed: {e}")

    return fallback


def take_snapshot() -> Snapshot:
    procs, names = collect_processes()
    geo = collect_geo_data()
    return Snapshot(
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        processes=procs,
        connections=collect_connections(),
        public_ip=geo["ip"],
        city=geo["city"],
        region=geo["region"],
        country=geo["country"],
        process_names=names,
    )
