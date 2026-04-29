const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.cookies.token; 

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const tutorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'tutor') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, tutors only' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, admins only' });
  }
};

module.exports = { protect, tutorOnly, adminOnly };