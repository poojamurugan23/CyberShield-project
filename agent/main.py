"""
main.py — Phantom Agent V1 Entry Point.
Rock solid loop implementation with cross-platform desktop UI to pick protected files on startup.
"""

import sys
import time
import signal
import logging
import argparse
from pathlib import Path
from typing import List

try:
    import tkinter as tk
    from tkinter import filedialog
    HAS_TK = True
except ImportError:
    HAS_TK = False

# We import modules safely; avoiding crashes by routing through config.py
from agent.config import COLLECTION_INTERVAL, EVIDENCE_DIR, logger as sys_logger
from agent.consent import request_consent
from agent.monitor import take_snapshot
from agent.logger import write_snapshot, should_rotate, rotate_log, TEMP_LOG
from agent.detector import analyse, simulate_login_failure
from agent.evidence import package_evidence
from agent.notifier import send_os_notification
from agent.emailer import send_email_alert
from agent.hasher import verify_integrity

logger = logging.getLogger("main")
_running = True


def _shutdown(signum, frame):
    global _running
    logger.info("Graceful shutdown signal received. Stopping agent safely...")
    _running = False


signal.signal(signal.SIGINT, _shutdown)
signal.signal(signal.SIGTERM, _shutdown)


def select_critical_files() -> List[Path]:
    """Launch filemanager so user can securely select files for anti-tamper tracking."""
    global HAS_TK
    selected_paths = []
    print("\n[📁] GUI File Selection: Choose critical documents/images to tamper-proof.")
    if HAS_TK:
        try:
            root = tk.Tk()
            root.withdraw()
            root.attributes('-topmost', True)
            files = filedialog.askopenfilenames(
                title="Phantom Agent - Select Critical Files to Protect",
                filetypes=[
                    ("All Files", "*.*"),
                    ("Document Files", "*.pdf;*.docx;*.txt"),
                    ("Image Files", "*.png;*.jpg;*.jpeg"),
                ]
            )
            for f in files:
                selected_paths.append(Path(f))
            root.destroy()
        except Exception as e:
            logger.warning(f"GUI File picker failed: {e}. Falling back to terminal.")
            HAS_TK = False
    
    if not HAS_TK and not selected_paths:
        print("[!] GUI unavailable. Type file paths manually (Leave empty & press Enter to finish):")
        while True:
            fp = input("File path > ").strip()
            if not fp: 
                break
            p = Path(fp)
            if p.exists() and p.is_file():
                selected_paths.append(p)
            else:
                print(f"[✗] File not found/invalid: {p}")
                
    if selected_paths:
        print(f"[✓] {len(selected_paths)} critical file(s) selected for protection.")
    return selected_paths


def run_agent(demo_mode: bool = False):
    """Core agent runtime. Safely shielded with try-except to prevent crashes."""
    print("=" * 60)
    print("  PHANTOM AGENT V1 — Reliability & Protection Edition")
    print("=" * 60)

    try:
        if not request_consent():
            sys.exit(0)
    except Exception as e:
        logger.critical(f"Consent framework crashed: {e}")
        sys.exit(1)
        
    # Hook for picking critical documents
    critical_files = select_critical_files()

    if not demo_mode:
        print("[⏳] Initialising security envelope... (Waiting 3 seconds)")
        time.sleep(3)

    print(f"\n[▶] Agent initialising…")
    print(f"[ℹ] Local Telemetry Database location: {TEMP_LOG.resolve()}")
    print(f"[▶] Polling Interval: {COLLECTION_INTERVAL}s | Press Ctrl+C to safely exit.\n")
    
    logger.info(f"Agent started natively. Tracking local data in: {TEMP_LOG.resolve()}")

    cycle = 0
    if demo_mode:
        logger.info("Demo mode active — parsing simulated threats.")
        for _ in range(3):
            simulate_login_failure()

    while _running:
        cycle += 1
        try:
            # ── 1. Monitor ──
            snapshot = take_snapshot()
            logger.info(
                f"[{cycle:>4}] Procs: {len(snapshot.processes):>4} | "
                f"Conns: {snapshot.connections:>4} | IP: {snapshot.public_ip}"
            )

            # ── 2. Log ──
            write_snapshot(snapshot)

            # ── 3. Rotate ──
            if should_rotate():
                archive = rotate_log()
                if archive:
                    logger.info(f"Routine log rotated successfully to {archive.name}")

            # ── 4. Detect ──
            alerts = analyse(snapshot)

            # ── 5. Evidence + Alert ──
            if alerts:
                logger.warning(f"{len(alerts)} threat(s) detected! Engaging protocols.")
                snapshot_data = snapshot.to_flat_row()
                incident_dir = package_evidence(alerts, snapshot_data, selected_files=critical_files)
                
                send_os_notification(alerts)
                send_email_alert(alerts, incident_dir, snapshot_data)

            # ── 6. Sleep Interruption Safety ──
            for _ in range(COLLECTION_INTERVAL):
                if not _running: break
                time.sleep(1)

        except KeyboardInterrupt:
            _shutdown(None, None)
        except Exception as e:
            logger.critical(f"Unhandled system error in cycle {cycle}: {e}", exc_info=True)
            time.sleep(2)  # Avoid hyper-looping errors

    print("\n[✓] Agent stopped cleanly. System resources freed.")
    logger.info("Agent process exited natively.")


def run_verify():
    """Verify integrity of all evidence folders safely."""
    print("=" * 60)
    print("  PHANTOM AGENT V1 — Evidence Integrity Check")
    print("=" * 60)

    try:
        if not EVIDENCE_DIR.exists():
            print("[!] No evidence directory found.")
            return

        incidents = sorted(EVIDENCE_DIR.iterdir())
        if not incidents:
            print("[!] No incidents found.")
            return

        for inc_dir in incidents:
            if not inc_dir.is_dir():
                continue
            print(f"\n📁 {inc_dir.name}")
            results = verify_integrity(inc_dir)
            for fname, status in results.items():
                icon = "✓" if status == "OK" else "✗"
                print(f"   [{icon}] {fname}: {status}")
    except Exception as e:
        logger.critical(f"Verify framework failure: {e}")


def main():
    parser = argparse.ArgumentParser(
        description="Phantom Agent V1 — Ethical Forensic Monitor"
    )
    sub = parser.add_subparsers(dest="command", help="Available commands")

    run_parser = sub.add_parser("run", help="Start the monitoring agent")
    run_parser.add_argument(
        "--demo", action="store_true", help="Run in demo mode (simulate threats)"
    )

    sub.add_parser("verify", help="Verify evidence integrity")
    args = parser.parse_args()

    # Routing
    if getattr(args, "command", None) == "run":
        run_agent(demo_mode=args.demo)
    elif getattr(args, "command", None) == "verify":
        run_verify()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
