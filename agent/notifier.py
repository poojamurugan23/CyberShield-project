"""
notifier.py — OS-level toast notifications via plyer.
"""

from typing import List
from plyer import notification

from agent.config import DASHBOARD_URL
from agent.detector import ThreatAlert


def send_os_notification(alerts: List[ThreatAlert]):
    """Fire a native OS toast notification for the top-severity alert."""
    if not alerts:
        return
    top = alerts[0]
    try:
        notification.notify(
            title=f"⚠ Phantom Agent — {top.severity} Alert",
            message=f"{top.description}\n\nDashboard → {DASHBOARD_URL}",
            app_name="Phantom Agent V1",
            timeout=10,
        )
    except Exception as e:
        print(f"[⚠] OS notification failed: {e}")
        
    # Guaranteed GUI Fallback
    try:
        import tkinter as tk
        from tkinter import messagebox
        root = tk.Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        user_clicked_yes = messagebox.askyesno(
            title=f"⚠ Phantom Agent — {top.severity} Alert",
            message=f"{top.description}\n\nDo you want to open the Dashboard to investigate?\n\n({DASHBOARD_URL})"
        )
        if user_clicked_yes:
            import webbrowser
            webbrowser.open(DASHBOARD_URL)
            
        root.destroy()
    except Exception as e2:
        print(f"[⚠] Backup popup failed: {e2}")
