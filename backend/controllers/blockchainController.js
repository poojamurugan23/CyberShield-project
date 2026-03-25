const { generateHash } = require("../utils/hashGenerator");

exports.createHash = (req, res) => {
  const { data } = req.body;

  const hash = generateHash(data);

  res.json({
    message: "Hash generated",
    hash,
  });
};

exports.verifyHash = (req, res) => {
  const { data, hash } = req.body;

  const newHash = generateHash(data);

  if (newHash === hash) {
    res.json({ valid: true, msg: "Data integrity verified" });
  } else {
    res.json({ valid: false, msg: "Data tampered" });
  }
};