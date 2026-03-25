"""
hasher.py — SHA-256 hashing and tamper verification.
Cross-platform safe, resilient to locked files.
"""

import logging
import hashlib
from pathlib import Path
from typing import Dict

logger = logging.getLogger("hasher")


def hash_file(filepath: Path) -> str | None:
    try:
        sha = hashlib.sha256()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(81920), b""):  # Slight optimization 80KB chunk
                sha.update(chunk)
        return sha.hexdigest()
    except Exception as e:
        logger.error(f"Hashing failed for {filepath.name}: {e}")
        return None


def hash_directory(directory: Path) -> Dict[str, str]:
    checksums: Dict[str, str] = {}
    try:
        # rglob to recursively hash copied protected documents too
        for item in sorted(directory.rglob("*")):
            if item.is_file() and item.name != "checksums.sha256":
                rel_name = item.relative_to(directory).as_posix()
                h = hash_file(item)
                if h:
                    checksums[rel_name] = h
    except Exception as e:
        logger.error(f"Directory hashing error: {e}")
    return checksums


def write_checksums(directory: Path) -> Path:
    checksum_file = directory / "checksums.sha256"
    try:
        checksums = hash_directory(directory)
        lines = [f"{h}  {name}" for name, h in checksums.items()]
        checksum_file.write_text("\n".join(lines) + "\n", encoding="utf-8")
    except Exception as e:
        logger.error(f"Failed to write checksums: {e}")
    return checksum_file


def verify_integrity(directory: Path) -> Dict[str, str]:
    checksum_file = directory / "checksums.sha256"
    if not checksum_file.exists():
        return {"_error": "No checksums.sha256 found"}

    stored: Dict[str, str] = {}
    try:
        content = checksum_file.read_text(encoding="utf-8")
        for line in content.strip().split("\n"):
            if not line.strip():
                continue
            parts = line.split("  ", 1)
            if len(parts) == 2:
                stored[parts[1]] = parts[0]
    except Exception as e:
        logger.error(f"Could not read checksum file: {e}")
        return {"_error": str(e)}

    results: Dict[str, str] = {}
    for name, expected_hash in stored.items():
        fpath = directory / name
        if not fpath.exists():
            results[name] = "MISSING"
        else:
            actual = hash_file(fpath)
            if actual is None:
                results[name] = "READ_ERROR"
            else:
                results[name] = "OK" if actual == expected_hash else "TAMPERED"

    return results
