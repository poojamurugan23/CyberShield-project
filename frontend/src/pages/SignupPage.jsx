import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Shield, Mail, Lock, User as UserIcon, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Signup failed");
        return;
      }

      alert("Node registered securely! Proceed to login.");
      navigate("/login");
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass" style={{ width: 450, textAlign: "center" }}>
        <UserPlus size={50} color="var(--neon-green)" style={{ marginBottom: 20 }} />
        <h2>REGISTER SECURE NODE</h2>
        <p style={{ marginBottom: 30, color: "var(--text-secondary)" }}>Create cryptographic credentials for vault access.</p>

        <div style={{ position: "relative", marginBottom: 15 }}>
           <UserIcon size={18} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 15, top: 15 }} />
           <input style={{ paddingLeft: 45, marginBottom: 0 }} placeholder="Operative Designation (Name)" onChange={e => setName(e.target.value)} />
        </div>

        <div style={{ position: "relative", marginBottom: 15 }}>
           <Mail size={18} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 15, top: 15 }} />
           <input style={{ paddingLeft: 45, marginBottom: 0 }} placeholder="Comms Address (Email)" onChange={e => setEmail(e.target.value)} />
        </div>
        
        <div style={{ position: "relative", marginBottom: 15 }}>
           <Briefcase size={18} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 15, top: 15 }} />
           <select style={{ paddingLeft: 45, marginBottom: 0 }} value={role} onChange={e => setRole(e.target.value)}>
             <option value="user" style={{ color: "#000" }}>Civilian (User)</option>
             <option value="investigator" style={{ color: "#000" }}>Investigator Officer</option>
             <option value="admin" style={{ color: "#000" }}>System Admin</option>
           </select>
        </div>

        <div style={{ position: "relative", marginBottom: 15 }}>
           <Lock size={18} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 15, top: 15 }} />
           <input style={{ paddingLeft: 45, marginBottom: 0 }} placeholder="Secure Passphrase" type="password" onChange={e => setPassword(e.target.value)} />
        </div>

        <button className="success" style={{ width: "100%", marginTop: 10, padding: 15 }} onClick={signup}>
          <Shield size={18} /> GENERATE IDENTITY
        </button>
        <p style={{ marginTop: 20, fontSize: "0.85rem", cursor: "pointer", color: "var(--text-secondary)" }} onClick={() => navigate("/login")}>
          Already registered? <span style={{ color: "var(--neon-cyan)" }}>Initiate Handshake</span>
        </p>
      </motion.div>
    </div>
  );
}