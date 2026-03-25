import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verify = async () => {
    const email = localStorage.getItem("loginEmail");

    if (!email) {
      alert("No email found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Invalid OTP");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "investigator") navigate("/investigator");
      else navigate("/dashboard");
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ width: 400, textAlign: "center" }}>
        <div style={{ background: "rgba(0, 229, 255, 0.1)", display: "inline-block", padding: 20, borderRadius: "50%", marginBottom: 20 }}>
          <Fingerprint size={60} color="var(--neon-cyan)" className="pulse" />
        </div>
        <h2>2FA VERIFICATION</h2>
        <p style={{ marginBottom: 30, color: "var(--text-secondary)" }}>A transmission has been sent your comms. Enter the 6-digit cryptographic sequence.</p>

        <input 
          style={{ textAlign: "center", letterSpacing: 10, fontSize: "1.5rem" }} 
          placeholder="000000" 
          maxLength={6}
          onChange={e => setOtp(e.target.value)} 
        />
        
        <button className="primary" style={{ width: "100%", marginTop: 10 }} onClick={verify}>CONFIRM IDENTITY</button>
      </motion.div>
    </div>
  );
}