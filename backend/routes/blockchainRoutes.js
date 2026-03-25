const router = require("express").Router();
const { generateHash } = require("../services/blockchainService");

router.post("/hash", (req, res) => {
  res.json({ hash: generateHash(req.body.data) });
});

module.exports = router;