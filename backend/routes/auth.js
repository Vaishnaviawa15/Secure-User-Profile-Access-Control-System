const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { encrypt, decrypt } = require("../utils/encryption");

const router = express.Router();

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, aadhaar } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedAadhaar = encrypt(aadhaar);

    const user = new User({
      email,
      password: hashedPassword,
      aadhaar: encryptedAadhaar,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: "Registration failed" });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

/**
 * PROFILE (Protected)
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const decryptedAadhaar = decrypt(user.aadhaar);

    res.json({
      email: user.email,
      aadhaar: decryptedAadhaar,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

module.exports = router;
