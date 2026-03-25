const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { register, login, verifyOTP, updateProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.put("/profile", auth, updateProfile);

module.exports = router;