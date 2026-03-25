import React, { useEffect, useState } from "react";
import { Database, Link as LinkIcon, Lock, Search, DownloadCloud, Fingerprint, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "user";

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/cases", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        // Filter based on role to maintain strict vault security boundaries
        if (userRole === "user") {
          setCases(data.filter(c => c.userEmail === user.email));
        } else if (userRole === "investigator") {
          // Investigators can see evidence for their assigned cases or Unassigned
          setCases(data.filter(c => c.investigatorEmail === user.email || !c.investigatorEmail));
        } else {
          // Admin sees entire global ledger
          setCases(data);
        }
      })
      .catch(console.error);
  }, [user.email, userRole]);

  const filteredCases = cases.filter(c => 
    c.hash?.includes(searchTerm) || 
    c.domain?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c._id.includes(searchTerm)
  );

  return (
    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 30 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="card-title" style={{ color: "var(--neon-green)", borderBottom: "none", margin: 0 }}>
          <Database size={28} /> CRYPTOGRAPHIC EVIDENCE VAULT
        </h2>
        <div style={{ position: "relative", width: 350 }}>
          <Search size={18} style={{ position: "absolute", left: 15, top: 12, color: "var(--text-secondary)" }} />
          <input 
            placeholder="Search by Hash, Type, or Node ID..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 45, margin: 0, borderRadius: 30, background: "rgba(0,0,0,0.4)" }} 
          />
        </div>
      </div>

      <p style={{ margin: "-10px 0 10px 0", color: "var(--text-secondary)" }}>
        Secure decentralized node storage mapping all logged digital forensics entries.
      </p>

      {/* Ledger Table Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 2.5fr 1fr 1fr", padding: "15px 20px", background: "rgba(0,230,118,0.1)", borderRadius: 8, color: "var(--neon-green)", fontWeight: "bold", fontSize: "0.85rem", border: "1px solid rgba(0,230,118,0.3)" }}>
         <div>BLOCK TIMESTAMP</div>
         <div>CLASSIFICATION</div>
         <div>SHA-256 INTEGRITY HASH</div>
         <div>SIMILARITY SCORE</div>
         <div>EVIDENCE PAYLOAD</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 15, maxHeight: "65vh", overflowY: "auto" }}>
        {filteredCases.map(c => (
          <motion.div 
            key={c._id} 
            whileHover={{ scale: 1.01, background: "rgba(0, 229, 255, 0.05)" }} 
            className="glass" 
            style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 2.5fr 1fr 1fr", padding: "20px", alignItems: "center", borderLeft: "4px solid var(--neon-cyan)" }}
          >
             <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
               {new Date(c.createdAt).toLocaleDateString()}<br/>
               {new Date(c.createdAt).toLocaleTimeString()}
             </div>

             <div>
               <span className="badge" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <Fingerprint size={12} style={{ marginRight: 5, verticalAlign: "middle" }}/> 
                  {c.domain}
               </span>
               <div style={{ marginTop: 5, fontSize: "0.75rem", color: c.severity === "High" ? "var(--neon-red)" : "var(--neon-green)" }}>
                 {c.severity} Severity Index
               </div>
             </div>

             <div className="monospaced" style={{ fontSize: "0.8rem", color: "var(--neon-cyan)", wordBreak: "break-all", background: "rgba(0,0,0,0.5)", padding: 8, borderRadius: 4, border: "1px dashed rgba(255,255,255,0.1)" }}>
               <Lock size={12} style={{ marginRight: 5, color: "#fff" }}/> 
               {c.hash || "Hash computation pending..."}
             </div>

             <div style={{ textAlign: "center", color: c.similarityScore > 50 ? "var(--neon-red)" : "var(--neon-blue)", fontWeight: "bold" }}>
                {c.similarityScore || 0}%
             </div>

             <div style={{ textAlign: "center" }}>
               {c.evidenceFile ? (
                 <a href={`http://localhost:5000${c.evidenceFile}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                   <button className="primary" style={{ padding: "8px 15px", fontSize: "0.8rem" }}>
                     <DownloadCloud size={14} style={{ marginRight: 5 }} /> VIEW RAW
                   </button>
                 </a>
               ) : (
                 <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>No Payload Attached</span>
               )}
             </div>

          </motion.div>
        ))}
        {filteredCases.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
            <Eye size={40} style={{ opacity: 0.2, marginBottom: 15 }} />
            <p>No cryptographic entries found matching your security clearance or query parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}