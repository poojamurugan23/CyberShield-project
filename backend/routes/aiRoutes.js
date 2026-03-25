const router = require("express").Router();
const { classifyText, summarizeText } = require("../controllers/aiController");

router.post("/classify", classifyText);
router.post("/summary", summarizeText);

module.exports = router;