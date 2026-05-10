const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isBlacklisted } = require('../utils/tokenBlacklist');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // ✅ FIX 1: decode() → verify() Bug Fix From My Side
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // ✅ FIX 2: Bug Fix From My Side
    if (isBlacklisted(token)) {
      return res.status(401).json({ success: false, message: 'Token invalidated. Please login again.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    // ✅ verify() fail hone par proper error
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { protect };