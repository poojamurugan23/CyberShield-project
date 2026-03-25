const Case = require("../models/Case");
const { classify, generateBrief, matchSimilarity, resolveSeverity, getSuggestedActions } = require("../services/aiService");
const { generateHash } = require("../services/blockchainService");
const { sendNotification } = require("../sockets/notificationSocket");
const { sendInvestigatorEmail } = require("../services/emailService");

exports.createCase = async (req, res) => {
  try {
    const { description, whatHappenedNext, userEmail, keystrokePriority } = req.body;
    if (!description) return res.status(400).json({ msg: "Description required" });

    const domain = classify(description);
    const hash = generateHash(description);
    
    // AI Insights
    const brief = generateBrief(domain);
    const severity = resolveSeverity(domain);
    const suggestedActions = getSuggestedActions(domain);
    
    // Past Case Matching
    const allCases = await Case.find();
    const similarityScore = matchSimilarity(description, allCases);

    const newCase = await Case.create({
      userId: req.user.id,
      userEmail: userEmail || process.env.TEST_RECEIVER_EMAIL,
      description,
      whatHappenedNext,
      keystrokePriority: keystrokePriority || "Normal",
      domain,
      hash,
      evidenceFile: req.file ? `/uploads/${req.file.filename}` : null,
      brief,
      severity,
      similarityScore,
      suggestedActions,
      status: "New"
    });

    sendNotification(`🚨 Priority ${keystrokePriority} Incident: ${domain} [${severity} Severity]`);
    res.json(newCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const c = await Case.findByIdAndUpdate(req.params.id, { status }, { new: true });
    sendNotification(`🔄 Case Update: Incident ID ending in ${c._id.toString().slice(-4)} is now ${status}`);
    res.json(c);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.assignCase = async (req, res) => {
  try {
    const { investigatorName, investigatorEmail } = req.body;
    const c = await Case.findByIdAndUpdate(req.params.id, { 
      status: "Under Investigation",
      investigatorId: req.user.id,
      investigatorName,
      investigatorEmail
    }, { new: true });
    
    // Send email to victim
    if (c.userEmail) {
      await sendInvestigatorEmail(c.userEmail, investigatorName, investigatorEmail);
    }

    sendNotification(`✅ Investigator Assigned: ${investigatorName} is handling Event ${c._id.toString().slice(-4)}`);
    res.json(c);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { text, senderRole, senderName } = req.body;
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ msg: "Case not found" });

    const newMsg = { text, senderRole, senderName, timestamp: new Date() };
    c.messages.push(newMsg);
    await c.save();

    const { emitMessage } = require("../sockets/notificationSocket");
    emitMessage({ caseId: c._id, message: newMsg });

    res.json(c);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};