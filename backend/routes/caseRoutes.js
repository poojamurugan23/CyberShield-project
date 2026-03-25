const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createCase, getCases, updateCaseStatus, assignCase } = require("../controllers/caseController");
const upload = require("../middleware/uploadMiddleware");

router.post("/", auth, upload.single("evidence"), createCase);
router.get("/", auth, getCases);
router.put("/:id/assign", auth, assignCase);
router.put("/:id/status", auth, updateCaseStatus);

module.exports = router;