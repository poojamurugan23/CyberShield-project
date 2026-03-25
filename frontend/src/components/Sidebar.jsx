import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Home, Search, LogOut, FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Read userRole dynamically every render without caching, so login/logout updates strictly
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "user";

  const getMenuItems = () => {
    if (userRole === "admin") {
      return [
        { path: "/admin", label: "Master Registry", icon: <Settings size={20}/> },
        { path: "/profile", label: "Global Vault", icon: <FileText size={20}/> }
      ];
    } else if (userRole === "investigator") {
      return [
        { path: "/investigator", label: "Investigator Ops", icon: <Search size={20}/> },
        { path: "/profile", label: "Evidence Vault", icon: <FileText size={20}/> }
      ];
    } else {
      return [
        { path: "/dashboard", label: "Civilian Dashboard", icon: <Home size={20}/> },
        { path: "/profile", label: "My Evidence", icon: <FileText size={20}/> }
      ];
    }
  };

  const menu = getMenuItems();

  return (
    <div className="glass" style={{ width: 280, margin: "20px 0 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
      <h4 style={{ color: "var(--text-secondary)", marginBottom: 20 }}>AUTHORIZATION LEVEL</h4>
      <div style={{ padding: "5px 15px", background: "rgba(0,229,255,0.1)", border: "1px solid var(--neon-cyan)", borderRadius: 8, marginBottom: 20 }}>
         {userRole.toUpperCase()} NODE
      </div>

      <h4 style={{ color: "var(--text-secondary)", marginBottom: 15 }}>NAVIGATION</h4>
      
      {menu.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <button 
            key={item.path}
            onClick={() => navigate(item.path)} 
            style={{ 
              justifyContent: "flex-start", padding: "12px 20px",
              background: isActive ? "linear-gradient(90deg, rgba(0,229,255,0.2) 0%, transparent 100%)" : "transparent",
              border: isActive ? "1px solid rgba(0,229,255,0.5)" : "1px solid transparent",
              color: isActive ? "#fff" : "var(--text-secondary)"
            }}
          >
            {item.icon} {item.label}
          </button>
        )
      })}
      
      <div style={{ marginTop: "auto" }}>
        <button 
          className="danger pulse"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          <LogOut size={20} /> CLOSE COMM-LINK
        </button>
      </div>
    </div>
  );
}