const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.post("/after-login", async (req, res) => {
  const { name, email, accessToken, refreshToken } = req.body;

  if (!email || !accessToken || !refreshToken) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let user = await User.findOne({ email });
  const isNewUser = !user;

  if (isNewUser) {
    user = await User.create({ name, email });
  }

  const token = jwt.sign(
    { userId: user._id, name, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    sameSite: "Lax",
  });

  return res.json({ token, isNewUser });
});

module.exports = router;
