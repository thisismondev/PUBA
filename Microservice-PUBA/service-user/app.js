const express = require('express');
const router = express.Router();
const auth = require('./controller/auth');
const token = require('./middleware/authMiddleware');

const verifyToken = token.verifyToken;

// Auth
router.post('/login', auth.login);
router.post('/logout', verifyToken, auth.logout);
router.post('/regist', auth.register);

module.exports = router;
