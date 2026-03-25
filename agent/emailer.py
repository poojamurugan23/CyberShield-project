"""
emailer.py — SMTP email alert sender.
Automatically secures all evidence inside a ZIP for safe transport via SMTP limits.
"""

import shutil
import logging
import hashlib
import platform
import smtplib
from email import encoders
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from typing import List

from agent.config import (
    SMTP_HOST, SMTP_PORT, EMAIL_USER, EMAIL_PASS,
    ALERT_RECIPIENT, DASHBOARD_URL, CONSENT_FILE,
)
from agent.detector import ThreatAlert

logger = logging.getLogger("emailer")


def _build_html(alerts: List[ThreatAlert], incident_dir: Path, snapshot_data: dict, consent_hash: str) -> str:
    hostname = platform.node()
    ip      = snapshot_data.get("public_ip", "Unknown")
    city    = snapshot_data.get("city", "N/A")
    region  = snapshot_data.get("region", "N/A")
    country = snapshot_data.get("country", "N/A")

    rows = ""
    for a in alerts:
        color = "#e53e3e" if a.severity in ("HIGH", "CRITICAL") else "#dd6b20"
        rows += f"""
        <tr>
            <td style="padding:12px;border-bottom:1px solid #718096;">
                <span style="color:{color};font-weight:bold;">[{a.severity}]</span> {a.rule}<br/>
                <small style="color:#cbd5e0;">{a.description}</small>
            </td>
        </tr>"""

    return f"""
    <html>
    <body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#1a202c;color:#e2e8f0;">
    <div style="padding:20px;">
        <div style="max-width:650px;margin:0 auto;background:#2d3748;border-radius:8px;
                    border-top:4px solid #e53e3e;overflow:hidden;
                    box-shadow:0 4px 6px rgba(0,0,0,0.3);">

            <div style="background:#1a202c;padding:20px 25px;border-bottom:1px solid #4a5568;">
                <h2 style="margin:0;color:#fc8181;font-size:20px;">🚨 PHANTOM SECURITY ALERT</h2>
                <p style="margin:5px 0 0;color:#a0aec0;font-size:13px;">Incident: {incident_dir.name}</p>
            </div>

            <div style="padding:25px;">
                <p>Anomalous activity detected on host <strong>{hostname}</strong>.</p>

                <div style="background:#4a5568;border-radius:6px;padding:15px;margin-bottom:25px;">
                    <h4 style="margin:0 0 10px;color:#fc8181;">🛑 Threat Summary</h4>
                    <table style="width:100%;border-collapse:collapse;font-size:14px;">{rows}</table>
                </div>

                <div style="background:#4a5568;border-radius:6px;padding:15px;margin-bottom:25px;">
                    <h4 style="margin:0 0 10px;color:#63b3ed;">📍 Digital Footprint</h4>
                    <table style="width:100%;font-size:14px;">
                        <tr><td style="color:#a0aec0;width:100px;">City</td><td><strong>{city}</strong></td></tr>
                        <tr><td style="color:#a0aec0;">Region</td><td><strong>{region}</strong></td></tr>
                        <tr><td style="color:#a0aec0;">Country</td><td><strong>{country}</strong></td></tr>
                        <tr><td style="color:#a0aec0;">Public IP</td><td><strong>{ip}</strong></td></tr>
                    </table>
                </div>

                <div style="background:#2b6cb0;border-radius:6px;padding:15px;margin-bottom:25px;
                            font-size:13px;font-family:monospace;">
                    <div style="color:#bee3f8;margin-bottom:5px;"><strong>🔐 INTEGRITY VERIFICATION</strong></div>
                    <div style="color:#e2e8f0;margin-bottom:8px;">
                        Consent Proof Hash (SHA-256):<br/>
                        <span style="color:#90cdf4;word-break:break-all;">{consent_hash}</span>
                    </div>
                    <div style="color:#e2e8f0;">
                        * Tamperproof evidence checksums and protected documents have been zipped and attached securely.
                    </div>
                </div>

                <div style="text-align:center;margin-top:25px;">
                    <a href="{DASHBOARD_URL}"
                       style="display:inline-block;background:#e53e3e;color:white;
                              padding:12px 24px;border-radius:5px;text-decoration:none;
                              font-weight:bold;">View Dashboard</a>
                    <p style="color:#a0aec0;font-size:11px;margin-top:15px;">
                        Local path: {incident_dir}
                    </p>
                </div>
            </div>
        </div>
    </div>
    </body>
    </html>"""


def send_email_alert(alerts: List[ThreatAlert], incident_dir: Path, snapshot_data: dict):
    if not EMAIL_USER or not EMAIL_PASS:
        logger.warning("SMTP credentials missing. Skipping email.")
        return

    consent_hash = "REVOKED OR MISSING"
    try:
        if CONSENT_FILE.exists():
            consent_hash = hashlib.sha256(CONSENT_FILE.read_bytes()).hexdigest()
    except Exception as e:
        logger.warning(f"Could not compute consent hash: {e}")

    try:
        # Optimization: ZIP evidence directory to prevent massive email memory bloat
        zip_path = incident_dir.with_suffix(".zip")
        shutil.make_archive(str(incident_dir), 'zip', str(incident_dir))
        
        subject = f"🛡️ [Phantom Alert] {alerts[0].severity} — {alerts[0].rule}"
        html = _build_html(alerts, incident_dir, snapshot_data, consent_hash)

        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = ALERT_RECIPIENT
        msg["Subject"] = subject
        msg.attach(MIMEText(html, "html"))

        # Attach single ZIP file
        if zip_path.exists():
            part = MIMEBase("application", "zip")
            with open(zip_path, "rb") as f:
                part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f'attachment; filename="{zip_path.name}"')
            msg.attach(part)

        # Connect & dispatch safely
        opt_context = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        opt_context.starttls()
        opt_context.login(EMAIL_USER, EMAIL_PASS)
        opt_context.send_message(msg)
        opt_context.quit()
        logger.info(f"Encrypted HTML email with evidence ZIP dispatched ({zip_path.name}).")
        
        # We can safely delete the temporary zip here to save space
        try:
            zip_path.unlink()
        except:
            pass

    except Exception as e:
        logger.error(f"Failed to dispatch email alert: {e}")
