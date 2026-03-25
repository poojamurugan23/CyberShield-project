import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cpu, ShieldCheck, Database, GitMerge } from "lucide-react";
import { motion } from "framer-motion";

export default function AIProcessingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/dashboard"), 3500);
  }, [navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ width: 500, textAlign: "center", padding: 40 }}>
        <Cpu size={60} color="var(--neon-cyan)" className="pulse" style={{ marginBottom: 20 }} />
        <h2 style={{ letterSpacing: 2, color: "var(--neon-cyan)" }}>AI TACTICAL ANALYSIS</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 30 }}>Engaging deep neural net to classify incident and compute blockchain consensus...</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 15, textAlign: "left", background: "rgba(0,0,0,0.3)", padding: 20, borderRadius: 10 }}>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", gap: 15, alignItems: "center", color: "var(--neon-blue)" }}>
             <ShieldCheck size={20} /> Classifying Attack Vector... [DONE]
          </motion.div>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2 }} style={{ display: "flex", gap: 15, alignItems: "center", color: "var(--neon-purple)" }}>
             <GitMerge size={20} /> Matching Against Global Threats... [DONE]
          </motion.div>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 2.0 }} style={{ display: "flex", gap: 15, alignItems: "center", color: "var(--neon-green)" }}>
             <Database size={20} /> Generating Blockchain Proof... [DONE]
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}