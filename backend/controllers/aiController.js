const { classify, summarize } = require("../services/aiService");

exports.classifyText = (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Text is required" });
    
    const domain = classify(text);
    res.json({ message: "Classification successful", domain });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.summarizeText = (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Text is required" });
    
    const summary = summarize(text);
    res.json({ message: "Summarization successful", summary });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};