module.exports.classify = (text) => {
  text = text.toLowerCase();
  if (text.includes("otp") || text.includes("link") || text.includes("password")) return "Phishing";
  if (text.includes("bank") || text.includes("money") || text.includes("transaction")) return "Financial Fraud";
  if (text.includes("virus") || text.includes("ransom") || text.includes("encrypted")) return "Malware";
  return "Unknown Attack";
};

module.exports.summarize = (text) => "AI Summary: " + text.slice(0, 100) + "...";

module.exports.generateBrief = (domain) => {
  switch(domain) {
    case "Phishing": return "Attacker attempting to steal credentials via deceptive communications.";
    case "Financial Fraud": return "Unauthorized transactions or financial manipulation detected.";
    case "Malware": return "Malicious software identified exhibiting destructive behavior.";
    default: return "General cyber incident requiring further manual investigation.";
  }
};

module.exports.resolveSeverity = (domain) => {
  if (domain === "Malware") return "High";
  if (domain === "Financial Fraud") return "High";
  if (domain === "Phishing") return "Medium";
  return "Low";
};

module.exports.getSuggestedActions = (domain) => {
  if (domain === "Phishing") return ["Block sender", "Reset credentials", "Enable 2FA"];
  if (domain === "Financial Fraud") return ["Freeze accounts", "Contact bank", "Audit logs"];
  if (domain === "Malware") return ["Isolate machine", "Run forensics", "Restore from backup"];
  return ["Monitor closely", "Review access logs"];
};

module.exports.matchSimilarity = (newDesc, allCases) => {
  // Simple mock AI similarity match based on text length & common words
  if (!allCases || allCases.length === 0) return 0;
  
  // Pick a random past case and assign a random similarity for mock
  let score = Math.floor(Math.random() * 40) + 40; // 40-80% match
  if (newDesc.length > 50) score += 15;
  return Math.min(score, 99);
};