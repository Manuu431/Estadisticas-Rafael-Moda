const jwt = require('jsonwebtoken');

const readOnlyMethods = ['GET', 'HEAD', 'OPTIONS'];

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (req.user.demo && !readOnlyMethods.includes(req.method)) return res.status(403).json({ error: 'Demo mode is read-only' });
  next();
};

module.exports = authMiddleware;