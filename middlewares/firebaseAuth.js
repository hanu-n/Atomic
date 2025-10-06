import admin from '../utils/firebaseAdmin.js';

export const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.error('Missing ID token');
    return res.status(401).json({ message: 'Missing ID token' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log('User authenticated:', decodedToken.email);
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
};

export const adminAuth = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    console.error('Admin access denied:', req.user?.email);
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  console.log('Admin access granted:', req.user.email);
  next();
};