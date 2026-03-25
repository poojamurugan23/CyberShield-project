const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/jwt");
const { generateOTP } = require("../services/otpService");
const { sendEmail } = require("../services/emailService");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed, role: role || "user" });
  res.json({ msg: "Registered" });
};

// LOGIN → SEND OTP
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: "User not found" });
  if (role && user.role !== role) return res.status(400).json({ msg: "Role mismatch. You are registered as " + user.role });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ msg: "Invalid password" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendEmail(email, otp);
  res.json({ msg: "OTP sent" });
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true }).select("-password -otp -otpExpires");
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};


// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp)
    return res.status(400).json({ msg: "Invalid OTP" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    SECRET
  );

  res.json({ token, user });
};