import React, { useEffect, useState } from "react";
import { Server, Terminal, Shield, Users, Activity, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function AdminDashboard() {
  const [cases, setCases] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [chartType, setChartType] = useState("histogram"); // histogram, pie, area

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/cases", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(setCases)
      .catch(console.error);
  }, []);

  const total = cases.length;
  const highRisk = cases.filter(c => c.severity === "High").length;
  const uniqueInvestigators = new Set(cases.filter(c => c.investigatorEmail).map(c => c.investigatorEmail)).size;

  const domains = ["All", "Phishing", "Financial Fraud", "Malware", "Data Breach"];
  const displayCases = selectedDomain === "All" ? cases : cases.filter(c => c.domain === selectedDomain);

  // Dynamic Chart Data Generation
  const chartData = [
    { name: "Phishing", count: cases.filter(c => c.domain === "Phishing").length },
    { name: "Financial Fraud", count: cases.filter(c => c.domain === "Financial Fraud").length },
    { name: "Malware", count: cases.filter(c => c.domain === "Malware").length },
    { name: "Data Breach", count: cases.filter(c => c.domain === "Data Breach").length }
  ];

  const COLORS = ["#00e5ff", "#e040fb", "#00e676", "#ff1744"];

  return (
    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 30 }}>
      <h2 className="card-title" style={{ color: "var(--neon-purple)", borderBottom: "none" }}>
        <Terminal size={28} /> GLOBAL ADMIN REPOSITORY
      </h2>
      
      {/* Analytics grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        <div className="glass" style={{ borderLeft: "4px solid var(--neon-cyan)" }}>
          <h4 style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>TOTAL METRICS</h4>
          <h2 style={{ fontSize: "2.5rem", color: "#fff", margin: "10px 0" }}>{total}</h2>
        </div>
        
        <div className="glass" style={{ borderLeft: "4px solid var(--neon-purple)" }}>
          <h4 style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>OFFICERS</h4>
          <h2 style={{ fontSize: "2.5rem", color: "#fff", margin: "10px 0" }}>{uniqueInvestigators}</h2>
        </div>

        <div className="glass" style={{ borderLeft: "4px solid var(--neon-red)" }}>
          <h4 style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>CRITICAL ALERTS</h4>
          <h2 style={{ fontSize: "2.5rem", color: "#fff", margin: "10px 0" }}>{highRisk}</h2>
        </div>
      </div>

      {/* Real-time Animated Graph Simulation */}
      <div className="glass" style={{ padding: 30, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ color: "var(--text-secondary)", display: "flex", gap: 10, margin: 0 }}><BarChart2 size={20} /> REAL-TIME DOMAIN SIMULATION</h4>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)} style={{ padding: "8px 15px", borderRadius: 8, background: "rgba(0,0,0,0.5)", color: "#fff", border: "1px solid var(--neon-purple)" }}>
            <option value="histogram">Histogram (Bar Chart)</option>
            <option value="pie">Pie Chart Distribution</option>
            <option value="area">Area Graph (Spline)</option>
          </select>
        </div>

        <div style={{ width: "100%", height: 350, marginTop: 20 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "histogram" ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" allowDecimals={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid var(--neon-cyan)" }} />
                <Bar dataKey="count" fill="var(--neon-cyan)" animationDuration={1500}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : chartType === "pie" ? (
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="count" animationDuration={1500}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid var(--neon-cyan)" }} />
              </PieChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-purple)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--neon-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" allowDecimals={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid var(--neon-cyan)" }} />
                <Area type="monotone" dataKey="count" stroke="var(--neon-purple)" fillOpacity={1} fill="url(#colorCount)" animationDuration={1500} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass" style={{ padding: "30px", marginTop: 10 }}>
        <h4 style={{ color: "var(--text-secondary)", display: "flex", gap: 10, marginBottom: 20 }}><Server size={20} /> DEPARTMENT / DOMAIN CASE ROUTING</h4>
        
        {/* Domain Tabs */}
        <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
          {domains.map(d => (
            <button key={d} 
              className={selectedDomain === d ? "primary" : ""} 
              style={{ background: selectedDomain === d ? "var(--neon-cyan)" : "rgba(255,255,255,0.05)", color: selectedDomain === d ? "#000" : "#fff", padding: "10px 20px" }}
              onClick={() => setSelectedDomain(d)}
            >
              {d} Department ({d === "All" ? total : cases.filter(c => c.domain === d).length})
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 15, maxHeight: "50vh", overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr", padding: "10px 20px", background: "rgba(255,255,255,0.05)", borderRadius: 8, color: "var(--text-secondary)", fontWeight: "bold", fontSize: "0.85rem" }}>
             <div>CASE ID</div>
             <div>VICTIM IDENTITY</div>
             <div>ASSIGNED OFFICER</div>
             <div>PROGRESS STATUS</div>
          </div>
          
          {displayCases.map(c => (
            <motion.div key={c._id} whileHover={{ scale: 1.01 }} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr", padding: "15px 20px", background: "rgba(0,0,0,0.3)", borderRadius: 8, alignItems: "center", borderLeft: `3px solid ${c.status === "New" ? "var(--neon-red)" : c.status === "Resolved" ? "var(--neon-green)" : "var(--neon-cyan)"}` }}>
               <div className="monospaced" style={{ color: "var(--neon-cyan)", fontSize: "0.85rem" }}>...{c._id.slice(-6).toUpperCase()}</div>
               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                 <Users size={16} /> <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.userEmail}</span>
               </div>
               <div>
                  {c.investigatorEmail ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                       <Shield size={16} color="var(--neon-purple)" />
                       <span>{c.investigatorName}</span>
                    </div>
                  ) : (
                    <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>Unassigned</span>
                  )}
               </div>
               <div>
                  <span className={`badge ${c.status === "New" ? "high" : (c.status === "Resolved" ? "low" : "medium")}`}>{c.status}</span>
               </div>
            </motion.div>
          ))}
          {displayCases.length === 0 && <p style={{ textAlign: "center", padding: 20 }}>No incidents logged in the {selectedDomain} department.</p>}
        </div>
      </div>
    </div>
  );
}