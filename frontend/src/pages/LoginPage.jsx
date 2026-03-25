import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Login failed");
        return;
      }

      localStorage.setItem("loginEmail", email);
      navigate("/otp");
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass" style={{ width: 400, textAlign: "center" }}>
        <ShieldCheck size={50} color="var(--neon-cyan)" style={{ marginBottom: 20 }} />
        <h2>NODE AUTHENTICATION</h2>
        <p style={{ marginBottom: 30, color: "var(--text-secondary)" }}>Enter credentials and specify authorization role to access.</p>

        <div style={{ position: "relative", marginBottom: 15 }}>
           <Briefcase size={18} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 15, top: 15 }} />
           <select style={{ paddingLeft: 45, marginBottom: 0 }} value={role} onChange={e => setRole(e.target.value)}>
             <option value="user" style={{ color: "#000" }}>Civilian (User)</option>
             <option value="investigator" style={{ color: "#000" }}>Investigator Officer</option>
             <option value="admin" style={{ color: "#000" }}>System Admin</option>
           </select>
        </div>

        <div style={{ position: "relative", marginBottom: 15 }}>
           <Mail size={18} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 15, top: 15 }} />
           <input style={{ paddingLeft: 45, marginBottom: 0 }} placeholder="Agent ID / Email" onChange={e => setEmail(e.target.value)} />
        </div>
        
        <div style={{ position: "relative", marginBottom: 15 }}>
           <Lock size={18} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 15, top: 15 }} />
           <input style={{ paddingLeft: 45, marginBottom: 0 }} placeholder="Passphrase" type="password" onChange={e => setPassword(e.target.value)} />
        </div>

        <button className="primary" style={{ width: "100%", marginTop: 10, padding: 15 }} onClick={login}>INITIATE HANDSHAKE</button>
        <p style={{ marginTop: 20, fontSize: "0.85rem", cursor: "pointer", color: "var(--neon-cyan)" }} onClick={() => navigate("/signup")}>Don't have access? Register here</p>
      </motion.div>
    </div>
  );
}