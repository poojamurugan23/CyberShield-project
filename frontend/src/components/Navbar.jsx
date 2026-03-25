import React, { useEffect, useState } from "react";
import { Bell, ShieldAlert, Cpu, User, LogOut, MessageSquare, Settings as SettingsIcon, Edit2, Save, X } from "lucide-react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // Profile editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("notification", (msg) => {
      setNotifications(prev => [msg, ...prev]);
    });
    return () => socket.disconnect();
  }, []);

  const openEditProfile = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setIsEditing(true);
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ name: editName, email: editEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsEditing(false);
      setShowProfile(false);
      alert("Profile updated securely.");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="glass" style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, 
      display: "flex", justifyContent: "space-between", alignItems: "center",
      margin: 0, borderRadius: 0, borderBottom: "1px solid rgba(0,229,255,0.2)",
      height: 80
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <div style={{ background: "rgba(0,229,255,0.1)", padding: 12, borderRadius: 12, border: "1px solid var(--neon-cyan)" }}>
          <ShieldAlert className="pulse" color="var(--neon-cyan)" size={32} />
        </div>
        <div>
          <h2 style={{ margin: 0, letterSpacing: 2, color: "#fff" }}>CHAKRAVYUHA</h2>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>DIGITAL EVIDENCE VAULT</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ padding: "5px 15px", background: "rgba(0,230,118,0.1)", border: "1px solid var(--neon-green)", borderRadius: 20, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8, color: "var(--neon-green)" }}>
          <Cpu size={14} /> SYSTEM SECURE
        </div>
        
        {/* MESSAGING ICON */}
        <div style={{ position: "relative" }}>
          <button style={{ padding: 10, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} onClick={() => setShowMessageDropdown(!showMessageDropdown)}>
            <MessageSquare size={22} color="var(--neon-cyan)" />
          </button>
          <AnimatePresence>
            {showMessageDropdown && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass" style={{ position: "absolute", top: 50, right: 0, width: 300, padding: 15, zIndex: 200, textAlign: "center" }}>
                <MessageSquare size={30} color="var(--neon-cyan)" style={{ marginBottom: 10 }} />
                <h4 style={{ margin: "0 0 10px 0" }}>Direct Channel Active</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>To chat with your assigned Investigator Officer, please click on your specific Under Progress Case Card in the dashboard.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NOTIFICATIONS ICON */}
        <div style={{ position: "relative" }}>
          <button style={{ padding: 10, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} onClick={() => setShowDropdown(!showDropdown)}>
            <Bell size={22} color="var(--text-primary)" />
            {notifications.length > 0 && <div style={{ position: "absolute", top: 2, right: 2, background: "var(--neon-red)", width: 10, height: 10, borderRadius: "50%" }}></div>}
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass" style={{ position: "absolute", top: 50, right: 0, width: 350, padding: 15, zIndex: 200 }}>
                <h4 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 }}>Live Message Box</h4>
                <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                  {notifications.length === 0 ? <p style={{ fontSize: "0.85rem" }}>No new notifications</p> : null}
                  {notifications.map((n, i) => (
                    <div key={i} style={{ padding: 10, background: "rgba(0,0,0,0.3)", borderRadius: 8, fontSize: "0.85rem", color: "#fff", borderLeft: "3px solid var(--neon-cyan)" }}>
                      {n}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROFILE ICON */}
        <div style={{ position: "relative" }}>
          <div 
            onClick={() => { setShowProfile(!showProfile); setIsEditing(false); }}
            style={{ width: 45, height: 45, borderRadius: "50%", background: "var(--neon-cyan)", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", color: "#000", cursor: "pointer" }}>
            <User size={24} />
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass" style={{ position: "absolute", top: 60, right: 0, width: 280, padding: 15, zIndex: 300 }}>
                
                {isEditing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "var(--neon-cyan)" }}>Edit Operative Node</h4>
                    <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Full Name" style={{ margin: 0, fontSize: "0.85rem", padding: 8 }} />
                    <input value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Comms Address" style={{ margin: 0, fontSize: "0.85rem", padding: 8 }} />
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <button style={{ flex: 1, padding: 8 }} onClick={() => setIsEditing(false)}><X size={14} /> Cancel</button>
                      <button className="primary" style={{ flex: 1, padding: 8 }} onClick={saveProfile}><Save size={14} /> Save</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 15 }}>
                      <h4 style={{ margin: 0, color: "var(--neon-cyan)" }}>{user.name || "Agent"}</h4>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>{user.email}</p>
                      <span className="badge" style={{ marginTop: 10, display: "inline-block" }}>{user.role}</span>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 15, marginBottom: 15 }}>
                      <button style={{ width: "100%", justifyContent: "flex-start", background: "transparent", border: "none" }} onClick={openEditProfile}>
                        <Edit2 size={16} style={{ marginRight: 10 }} /> Edit Profile
                      </button>
                      <button style={{ width: "100%", justifyContent: "flex-start", background: "transparent", border: "none" }} onClick={() => alert("Settings panel mock opened.")}>
                        <SettingsIcon size={16} style={{ marginRight: 10 }} /> Settings & Preferences
                      </button>
                    </div>

                    <button className="danger" style={{ width: "100%", justifyContent: "center" }} onClick={() => { localStorage.clear(); navigate("/login"); }}>
                      <LogOut size={16} /> SIGN OUT
                    </button>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}