const { verifyToken } = require('../utils/jwt.js');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Invalid token.' });   // e.g.: if token is expired
  }
};

module.exports = authenticate;
