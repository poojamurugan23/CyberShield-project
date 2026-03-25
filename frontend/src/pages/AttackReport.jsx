import React, { useState } from "react";
import { UploadCloud, ShieldAlert, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AttackReportPage() {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!desc) {
      alert("Description is required");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("description", desc);
    if (file) {
      formData.append("evidence", file);
    }

    try {
      const res = await fetch("http://localhost:5000/api/cases", {
        method: "POST",
        headers: {
          Authorization: token // Note: No Content-Type, fetch sets multipart boundary automatically
        },
        body: formData
      });

      if (!res.ok) throw new Error("Submission Failed");
      
      // Navigate to AI processing screen to simulate processing step gracefully
      navigate("/ai");
    } catch (err) {
      alert("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="glass" style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 className="card-title" style={{ color: "var(--neon-red)" }}>
        <ShieldAlert size={28} /> REPORT CYBER INCIDENT
      </h2>
      <p style={{ marginBottom: 30 }}>Provide detailed information about the attack. Our AI engine will automatically classify the threat, extract IOCs, and secure the evidence on the blockchain.</p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--neon-cyan)" }}>INCIDENT DESCRIPTION</label>
          <textarea 
            placeholder="Describe what happened... (e.g. Received a suspicious email claiming my bank account is locked)" 
            rows={5}
            value={desc}
            onChange={e => setDesc(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--neon-cyan)" }}>EVIDENCE ATTACHMENT</label>
          <div style={{ position: "relative" }}>
            <input 
              type="file" 
              onChange={e => setFile(e.target.files[0])} 
              style={{ opacity: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: "pointer", zIndex: 10 }}
            />
            <div style={{ border: "2px dashed rgba(0,229,255,0.4)", padding: 40, borderRadius: 12, textAlign: "center", background: "rgba(0,0,0,0.3)" }}>
              <UploadCloud size={40} color="var(--neon-cyan)" style={{ marginBottom: 15 }} />
              <h4>{file ? file.name : "Drag & Drop or Click to Upload Evidence"}</h4>
              <p style={{ marginTop: 5, fontSize: "0.85rem" }}>Supports PDF, JPG, PNG, PCAP (Max 10MB)</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button type="submit" className="primary" disabled={loading} style={{ padding: "15px 40px", fontSize: "1.1rem" }}>
             {loading ? <Cpu className="pulse" size={20} /> : <ShieldAlert size={20} />}
             &nbsp; SECURE & SUBMIT REPORT
          </button>
        </div>
      </form>
    </motion.div>
  );
}