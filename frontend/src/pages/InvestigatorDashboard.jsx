import React, { useEffect, useState } from "react";
import { Activity, Shield as ShieldIcon, ThumbsUp, CheckCircle, Mail, AlertTriangle, Image as ImageIcon, Check, Send, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";

export default function InvestigatorDashboard() {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const investigator = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchCases = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/cases", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        setCases(data);
        if (selectedCase) {
          const updated = data.find(c => c._id === selectedCase._id);
          if (updated) setSelectedCase(updated);
        }
      })
      .catch(console.error);
  };

  useEffect(() => { fetchCases(); }, [forceUpdate]);
  
  // Real-time dynamic socket connection for interactive chat
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("new_message", () => setForceUpdate(Date.now()));
    return () => socket.disconnect();
  }, []);

  const acceptCase = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/cases/${id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ investigatorName: investigator.name || "Officer", investigatorEmail: investigator.email })
      });
      fetchCases(); 
      setSelectedCase(null);
    } catch (err) { alert("Assignment failed"); }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/cases/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ status: newStatus })
      });
      fetchCases();
      setSelectedCase(null);
    } catch (err) { alert("Update failed"); }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !selectedCase) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/cases/${selectedCase._id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ text: chatInput, senderRole: investigator.role, senderName: investigator.name || "Officer" })
      });
      setChatInput("");
      fetchCases();
    } catch (err) {
      console.error(err);
    }
  };

  const total = cases.length;
  const underProgress = cases.filter(c => c.status === "Under Investigation").length;
  const solved = cases.filter(c => c.status === "Resolved" || c.status === "Closed").length;

  const displayedCases = cases.filter(c => {
    if (filter === "progress") return c.status === "Under Investigation";
    if (filter === "solved") return c.status === "Resolved" || c.status === "Closed";
    return true;
  });

  return (
    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 30 }}>
      <h2 className="card-title" style={{ color: "var(--neon-blue)", borderBottom: "none" }}>
        <ShieldIcon size={28} /> INVESTIGATOR MESSAGE QUEUE
      </h2>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        <motion.div whileHover={{ scale: 1.02 }} className="glass stat-card" style={{ cursor: "pointer", borderTopColor: "var(--neon-cyan)" }} onClick={() => setFilter("all")}>
          <h3>{total}</h3><p>Total Cases</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="glass stat-card" style={{ cursor: "pointer", borderTopColor: "var(--neon-blue)" }} onClick={() => setFilter("progress")}>
          <h3>{underProgress}</h3><p>Under Progress</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="glass stat-card" style={{ cursor: "pointer", borderTopColor: "var(--neon-green)" }} onClick={() => setFilter("solved")}>
          <h3>{solved}</h3><p>Cases Solved</p>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* COMPLAINTS INBOX */}
        <div className="glass" style={{ height: "60vh", overflowY: "auto", padding: 15 }}>
          <h4 style={{ marginBottom: 15, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
            <Mail /> Incoming Complaints & Analytics
          </h4>
          
          <AnimatePresence>
            {displayedCases.map(c => (
              <motion.div 
                key={c._id} 
                onClick={() => setSelectedCase(c)}
                whileHover={{ scale: 1.01 }}
                style={{ background: selectedCase?._id === c._id ? "rgba(0, 229, 255, 0.1)" : "rgba(0,0,0,0.3)", padding: 15, borderRadius: 8, marginBottom: 15, cursor: "pointer", borderLeft: `4px solid ${c.keystrokePriority === "High" ? "var(--neon-red)" : "var(--neon-cyan)"}` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h4 style={{ margin: 0, color: c.status === "New" ? "var(--neon-cyan)" : "var(--text-secondary)" }}>{c.userEmail}</h4>
                  <span className={`badge ${c.status === "New" ? "high" : "low"}`}>{c.status}</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.description}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {displayedCases.length === 0 && <p>No cases in this queue.</p>}
        </div>

        {/* INTERACTIVE CASE VIEWER */}
        <div className="glass" style={{ height: "60vh", overflowY: "auto", padding: 25, position: "relative" }}>
          {selectedCase ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ color: "var(--neon-cyan)", margin: 0 }}>Case Detail View</h3>
                <span className="badge">{selectedCase.domain} Attack</span>
              </div>
              <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "20px 0" }} />
              
              <div style={{ background: "rgba(255,23,68,0.1)", padding: 15, borderRadius: 8, border: "1px solid rgba(255,23,68,0.3)", marginBottom: 20 }}>
                <h5 style={{ margin: "0 0 10px 0", color: "var(--neon-red)", display: "flex", alignItems: "center", gap: 5 }}><AlertTriangle size={18} /> VICTIM COMPLAINT: {selectedCase.userEmail}</h5>
                <p style={{ margin: 0, fontSize: "0.95rem" }}>"{selectedCase.description}"</p>
                {selectedCase.whatHappenedNext && (
                  <p style={{ marginTop: 15, fontSize: "0.95rem", color: "var(--text-secondary)" }}><strong>Aftermath:</strong> "{selectedCase.whatHappenedNext}"</p>
                )}
              </div>

              {selectedCase.evidenceFile && (
                <div style={{ marginBottom: 20 }}>
                  <h5 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: 5 }}><ImageIcon size={18} /> Uploaded Evidence</h5>
                  <img src={`http://localhost:5000${selectedCase.evidenceFile}`} alt="Evidence" style={{ maxWidth: "100%", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.3)" }} />
                </div>
              )}

              {/* Chat Window with Victim */}
              {selectedCase.investigatorEmail === investigator.email && (
                <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", overflow: "hidden", marginTop: 20 }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: 10, borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
                     <MessageSquare size={18} color="var(--neon-cyan)" /> <h5 style={{ margin: 0 }}>Direct Comm: Victim {selectedCase.userEmail}</h5>
                  </div>
                  <div style={{ padding: 15, maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                    {selectedCase.messages?.length === 0 ? <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>Send a protocol message to the victim.</p> : null}
                    {selectedCase.messages?.map((m, i) => (
                      <div key={i} style={{ alignSelf: m.senderRole === investigator.role ? "flex-end" : "flex-start", background: m.senderRole === investigator.role ? "rgba(0,230,118,0.1)" : "rgba(255,255,255,0.1)", padding: "8px 15px", borderRadius: 8, maxWidth: "80%", border: `1px solid ${m.senderRole === investigator.role ? "var(--neon-green)" : "rgba(255,255,255,0.2)"}` }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>{m.senderName}</span>
                        <span style={{ fontSize: "0.9rem" }}>{m.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 10, background: "rgba(255,255,255,0.05)", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 10 }}>
                     <input placeholder="Type instructions or updates..." value={chatInput} onChange={e => setChatInput(e.target.value)} style={{ margin: 0, background: "rgba(0,0,0,0.5)" }} onKeyDown={e => e.key === "Enter" && sendMessage()} />
                     <button className="success" onClick={sendMessage} style={{ padding: "0 15px" }}><Send size={18} /></button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ marginTop: 30, display: "flex", gap: 15, justifyContent: "flex-end", background: "rgba(0,0,0,0.5)", padding: 20, borderRadius: 8 }}>
                {selectedCase.status === "New" && (
                   <div style={{ width: "100%" }}>
                     <p style={{ marginBottom: 15, fontSize: "0.9rem" }}>Will you assign this case to yourself? (Victim will be notified immediately)</p>
                     <button className="primary pulse" onClick={() => acceptCase(selectedCase._id)} style={{ width: "100%", padding: 15 }}>
                       <Check size={18} /> YES, TAKE CASE
                     </button>
                   </div>
                )}
                
                {selectedCase.status === "Under Investigation" && selectedCase.investigatorEmail === investigator.email && (
                  <button onClick={() => updateStatus(selectedCase._id, "Resolved")} className="success" style={{ width: "100%", padding: 15 }}>
                    <ThumbsUp size={18} /> Mark Case as Resolved
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
               Select a complaint from the queue to view analytics, images, and chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}