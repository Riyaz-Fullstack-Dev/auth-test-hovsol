const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { blacklistToken } = require("../utils/tokenBlacklist");

const signAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "5m",
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    const user = await User.create({ name, email, password });
    const accessToken = signAccessToken(user._id);
    res.status(201).json({
      success: true,
      message: "Registered successfully",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const accessToken = signAccessToken(user._id);
    res.json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    blacklistToken(req.token); // ✅ FIX 3: token blacklist Bug Fix
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,  // ✅ FIX 4: Bug Fix and id add From My side
      name: req.user.name,
      email: req.user.email,
    },
  });
};

module.exports = { register, login, logout, getMe };