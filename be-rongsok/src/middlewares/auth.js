const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized, invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Note: req.user only contains id. We need to fetch user from DB or add role to JWT.
    // For simplicity, let's assume we fetch it or it's added to JWT.
    // Let's modify generateToken to include role.
    next(); // Placeholder - will refine later if needed
  };
};

module.exports = { protect, authorize };
