const admin = require('firebase-admin');


const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or Malformed Token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };
        next(); 
    } catch (error) {
        console.error('Token Verification Failed:', error);
        return res.status(403).json({ error: 'Forbidden: Invalid Token' });
    }
};

module.exports = checkAuth;