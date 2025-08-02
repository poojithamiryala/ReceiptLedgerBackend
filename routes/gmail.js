const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

function verifyAuth(req, res, next) {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach to req
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

router.get("/messages", verifyAuth, async (req, res) => {
  const userEmail = req.user.email;

  // TODO: Fetch Gmail using saved credentials in DB or proxy token
  return res.json({ email: userEmail, messages: [] });
});

module.exports = router;
