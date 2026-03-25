import React, { useState, useEffect } from "react";
import { ShieldAlert, AlertTriangle, Image as ImageIcon, CheckCircle, Send, MessageSquare, Mic, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";

export default function UserDashboard() {
  const [cases, setCases] = useState([]);
  const [showAttackForm, setShowAttackForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [next, setNext] = useState("");
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  
  const [selectedCase, setSelectedCase] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [forceUpdate, setForceUpdate] = useState(0);
  const [listeningField, setListeningField] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchCases = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/cases", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        const userCases = data.filter(c => c.userEmail === user.email);
        setCases(userCases);
        if (selectedCase) {
          const updated = userCases.find(c => c._id === selectedCase._id);
          if (updated) setSelectedCase(updated);
        }
      })
      .catch(console.error);
  };

  useEffect(() => { fetchCases(); }, [forceUpdate]);
  
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("new_message", () => setForceUpdate(Date.now()));
    return () => socket.disconnect();
  }, []);

  const handleSpeech = (setter, field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || "en-US";
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setListeningField(field);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setter(prev => prev ? prev + " " + transcript : transcript);
    };
    
    recognition.onerror = (event) => {
      setListeningField(null);
      if (event.error === 'no-speech') {
        console.log("No speech detected.");
      } else if (event.error === 'audio-capture') {
        alert("No microphone found. Please ensure your microphone is plugged in.");
      } else if (event.error === 'not-allowed') {
        alert("Microphone permission was denied. Please allow microphone access in your browser settings.");
      } else {
        console.error("Microphone error: " + event.error);
      }
    };

    recognition.onend = () => {
      setListeningField(null);
    };
    
    recognition.start();
  };

  const submitAttack = async (e) => {
    e.preventDefault();
    if (!desc) { alert("Description is required"); return; }
    
    setLoadingStage(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoadingStage(2);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoadingStage(3);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const priority = desc.length > 50 ? "High" : "Normal";
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("description", desc);
    formData.append("whatHappenedNext", next);
    formData.append("userEmail", user.email);
    formData.append("keystrokePriority", priority);
    if (file) formData.append("evidence", file);

    try {
      const res = await fetch("http://localhost:5000/api/cases", {
        method: "POST",
        headers: { Authorization: token },
        body: formData
      });
      if (!res.ok) throw new Error("Submission Failed");
      
      setLoadingStage(0);
      setShowAttackForm(false);
      
      // Clear inputs
      setDesc("");
      setNext("");
      setFile(null);
      
      setShowSuccess(true);
      fetchCases();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setLoadingStage(0);
      alert("Server error.");
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !selectedCase) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/cases/${selectedCase._id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ text: chatInput, senderRole: user.role, senderName: user.name || "User" })
      });
      setChatInput("");
      fetchCases();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "New": return <span className="badge" style={{ background:"rgba(255,160,0,0.2)", color:"#ffa000", border:"1px solid #ffa000" }}>New</span>;
      case "Under Investigation": return <span className="badge" style={{ background:"rgba(41,98,255,0.2)", color:"var(--neon-blue)", border:"1px solid var(--neon-blue)" }}>Under Investigation</span>;
      case "Resolved": return <span className="badge" style={{ background:"rgba(0,230,118,0.2)", color:"var(--neon-green)", border:"1px solid var(--neon-green)" }}>Resolved</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ y:-50, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ opacity:0 }}
            style={{ position: "fixed", top: 100, right: 30, background: "rgba(0,230,118,0.2)", border: "1px solid var(--neon-green)", padding: "15px 30px", borderRadius: 8, color: "var(--neon-green)", zIndex: 1000, display: "flex", gap: 10, alignItems: "center" }}>
            <CheckCircle /> CASE SUBMITTED
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Active Incident Reports</h2>
        <button className="danger pulse" style={{ padding: "20px 40px", fontSize: "1.25rem", borderRadius: 50, boxShadow: "0 0 20px rgba(255,23,68,0.4)" }} onClick={() => setShowAttackForm(true)}>
          <ShieldAlert size={28} /> I'M UNDER ATTACK
        </button>
      </div>

      {/* ATTACK MODAL FORM */}
      <AnimatePresence>
        {showAttackForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", background: "rgba(0,0,0,0.8)", zIndex: 500, display: "flex", justifyContent: "center", alignItems: "center" }}>
            
            <div className="glass" style={{ width: 600, maxHeight: "90vh", overflowY: "auto", border: "1px solid var(--neon-red)", position: "relative" }}>
              
              {/* CLAUDE/CHATGPT STYLE LOADING OVERLAY */}
              <AnimatePresence>
                {loadingStage > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.95)", zIndex: 600, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "0 60px" }}>
                    
                    {/* Stage 1 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 15, opacity: loadingStage >= 1 ? 1 : 0.3 }}>
                       <motion.div animate={{ scale: loadingStage === 1 ? [1, 1.4, 1] : 1 }} transition={{ repeat: loadingStage === 1 ? Infinity : 0, duration: 1 }} style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--neon-cyan)" }} />
                       <h4 style={{ color: "var(--neon-cyan)", margin: 0 }}>AI is summarizing for you!!</h4>
                    </div>
                    
                    <motion.div initial={{ height: 0 }} animate={{ height: loadingStage >= 2 ? 50 : 0 }} style={{ width: 2, background: "var(--neon-cyan)", margin: "5px 0", alignSelf: "flex-start", marginLeft: 9 }} />
                    
                    {/* Stage 2 */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: loadingStage >= 2 ? 1 : 0 }} style={{ display: "flex", alignItems: "center", gap: 15, alignSelf: "flex-start" }}>
                       <motion.div animate={{ scale: loadingStage === 2 ? [1, 1.4, 1] : 1 }} transition={{ repeat: loadingStage === 2 ? Infinity : 0, duration: 1 }} style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--neon-purple)" }} />
                       <h4 style={{ color: "var(--neon-purple)", margin: 0 }}>AI is classifying your domain of your problem!!</h4>
                    </motion.div>
                    
                    <motion.div initial={{ height: 0 }} animate={{ height: loadingStage >= 3 ? 50 : 0 }} style={{ width: 2, background: "var(--neon-purple)", margin: "5px 0", alignSelf: "flex-start", marginLeft: 9 }} />

                    {/* Stage 3 */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: loadingStage >= 3 ? 1 : 0 }} style={{ display: "flex", alignItems: "center", gap: 15, alignSelf: "flex-start" }}>
                       <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--neon-green)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Check size={14} color="#000" />
                       </div>
                       <h4 style={{ color: "var(--neon-green)", margin: 0 }}>Optimization Complete</h4>
                    </motion.div>

                  </motion.div>
                )}
              </AnimatePresence>

              <h2 style={{ color: "var(--neon-red)", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,23,68,0.3)", paddingBottom: 15 }}>
                <AlertTriangle /> INCIDENT CLASSIFICATION FORM
              </h2>
              
              <form onSubmit={submitAttack} style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 20 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <label style={{ color: "var(--neon-cyan)", margin: 0 }}>Elaborate about your attack happened</label>
                    <button 
                       type="button" 
                       onClick={() => handleSpeech(setDesc, 'desc')} 
                       style={{ padding: "5px 10px", borderRadius: 20, background: listeningField === 'desc' ? "rgba(255,23,68,0.2)" : "rgba(0,229,255,0.1)", border: listeningField === 'desc' ? "1px solid var(--neon-red)" : "1px solid var(--neon-cyan)", color: listeningField === 'desc' ? "var(--neon-red)" : "var(--neon-cyan)", display: "flex", alignItems: "center", gap: 5 }}>
                      <Mic size={14} className={listeningField === 'desc' ? "pulse" : ""} /> {listeningField === 'desc' ? "Listening..." : "Speak"}
                    </button>
                  </div>
                  <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)} required />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <label style={{ color: "var(--neon-cyan)", margin: 0 }}>What happened next?</label>
                    <button 
                       type="button" 
                       onClick={() => handleSpeech(setNext, 'next')} 
                       style={{ padding: "5px 10px", borderRadius: 20, background: listeningField === 'next' ? "rgba(255,23,68,0.2)" : "rgba(0,229,255,0.1)", border: listeningField === 'next' ? "1px solid var(--neon-red)" : "1px solid var(--neon-cyan)", color: listeningField === 'next' ? "var(--neon-red)" : "var(--neon-cyan)", display: "flex", alignItems: "center", gap: 5 }}>
                      <Mic size={14} className={listeningField === 'next' ? "pulse" : ""} /> {listeningField === 'next' ? "Listening..." : "Speak"}
                    </button>
                  </div>
                  <textarea rows={3} value={next} onChange={e => setNext(e.target.value)} placeholder="(e.g. system crashed, money deducted)" />
                </div>
                <div>
                  <label style={{ color: "var(--neon-cyan)", display: "block", marginBottom: 5 }}>Upload Evidence (Screenshots/Logs)</label>
                  <input type="file" onChange={e => setFile(e.target.files[0])} />
                </div>
                
                <div style={{ display: "flex", gap: 15, justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setShowAttackForm(false)}>Cancel</button>
                  <button type="submit" className="primary">SUBMIT REPORT TO AI</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* COMPLAINTS CARDS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 15, maxHeight: "70vh", overflowY: "auto", paddingRight: 10 }}>
          {cases.length === 0 && <p>You have not submitted any complaints yet.</p>}
          {cases.map((c) => (
            <div 
              key={c._id} 
              className="glass" 
              onClick={() => setSelectedCase(c)}
              style={{ cursor: "pointer", borderLeft: c.severity === "High" ? "4px solid var(--neon-red)" : "4px solid var(--neon-cyan)", background: selectedCase?._id === c._id ? "rgba(0, 229, 255, 0.1)" : "rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: 0 }}>Incident: {c.domain}</h4>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                {getStatusBadge(c.status)}
              </div>
            </div>
          ))}
        </div>

        {/* DETAILED INVESTIGATION VIEW */}
        <div className="glass" style={{ height: "70vh", overflowY: "auto" }}>
          {selectedCase ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 15 }}>
                <h3 style={{ margin: 0, color: "var(--neon-cyan)" }}>Case Details</h3>
                {selectedCase.investigatorName && <span style={{ color: "var(--neon-green)", fontSize: "0.85rem", border: "1px solid var(--neon-green)", padding: "4px 10px", borderRadius: 20 }}>Assigned to: {selectedCase.investigatorName}</span>}
              </div>

              <div>
                <p><strong>Complaint:</strong> {selectedCase.description}</p>
                {selectedCase.whatHappenedNext && <p><strong>Aftermath:</strong> {selectedCase.whatHappenedNext}</p>}
              </div>

              {/* AI GENERATED SUMMARY & DOMAIN VISIBLE TO USER */}
              <div style={{ background: "rgba(0, 229, 255, 0.05)", padding: 15, borderRadius: 8, border: "1px solid rgba(0,229,255,0.2)", marginBottom: 10 }}>
                <h5 style={{ margin: "0 0 10px 0", color: "var(--neon-cyan)" }}>AI SUMMARIZED INTEL</h5>
                <p style={{ fontSize: "0.9rem", margin: 0 }}>{selectedCase.brief}</p>
                <div style={{ marginTop: 10, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                   <strong>Assigned Domain:</strong> <span style={{ color: "var(--neon-purple)" }}>{selectedCase.domain}</span>
                </div>
              </div>

              {selectedCase.evidenceFile && (
                <div>
                  <h5 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: 5 }}><ImageIcon size={18} /> Evidence</h5>
                  <img src={`http://localhost:5000${selectedCase.evidenceFile}`} alt="Evidence" style={{ maxWidth: "100%", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.3)" }} />
                </div>
              )}

              {selectedCase.investigatorId && (
                <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: 10, borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
                     <MessageSquare size={18} color="var(--neon-cyan)" /> <h5 style={{ margin: 0 }}>Direct Comm: Officer {selectedCase.investigatorName}</h5>
                  </div>
                  <div style={{ padding: 15, maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                    {selectedCase.messages?.length === 0 ? <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>No messages yet.</p> : null}
                    {selectedCase.messages?.map((m, i) => (
                      <div key={i} style={{ alignSelf: m.senderRole === user.role ? "flex-end" : "flex-start", background: m.senderRole === user.role ? "rgba(0,229,255,0.1)" : "rgba(255,255,255,0.1)", padding: "8px 15px", borderRadius: 8, maxWidth: "80%", border: `1px solid ${m.senderRole === user.role ? "rgba(0,229,255,0.3)" : "rgba(255,255,255,0.2)"}` }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: 3 }}>{m.senderName}</span>
                        <span style={{ fontSize: "0.9rem" }}>{m.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 10, background: "rgba(255,255,255,0.05)", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 10 }}>
                     <input placeholder="Type a message..." value={chatInput} onChange={e => setChatInput(e.target.value)} style={{ margin: 0, background: "rgba(0,0,0,0.5)" }} onKeyDown={e => e.key === "Enter" && sendMessage()} />
                     <button className="primary" onClick={sendMessage} style={{ padding: "0 15px" }}><Send size={18} /></button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
               Click a case card to view details, evidence, and officer chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}