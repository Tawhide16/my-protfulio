import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied.' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_jwt_secret_key_12345');
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, authorization denied.' });
    }

    req.adminId = verified.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired.', error: err.message });
  }
};

export default auth;
