const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to authenticate JWT tokens
function auth(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
}

// Middleware to check if user has admin role
function adminAuth(req, res, next) {
  auth(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied, admin privilege required' });
    }
  });
}

module.exports = { auth, adminAuth }; 