import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign:"center", padding:100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <ShieldAlert size={80} color="var(--neon-cyan)" className="pulse" style={{ marginBottom: 20 }} />
      <h1 style={{ color: "var(--neon-cyan)", fontSize: "3.5rem", letterSpacing: "2px" }}>CHAKRAVYUHA</h1>
      <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: 600, margin: "20px auto 40px" }}>
        Advanced Digital Evidence Vault & Incident Response Architecture.
        Securing cybercrime data on immutable nodes with AI-driven threat matching.
      </p>
      
      <div style={{ display: "flex", gap: 20 }}>
        <button className="primary" onClick={() => navigate("/login")}>
          Secure Login <ArrowRight size={18} />
        </button>
        <button onClick={() => navigate("/signup")}>
          Register Node
        </button>
      </div>
    </div>
  );
}