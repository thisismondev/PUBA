const express = require('express');
const router = express.Router();
const auth = require('./controller/auth');
const user = require('./controller/user');
const token = require('./middleware/authMiddleware');

console.log('Auth controller:', auth);
console.log('User controller:', user);
console.log('getFakultas:', user.getFakultas);

const verifyToken = token.verifyToken;

// Auth
router.post('/login', auth.login);
router.post('/logout', verifyToken, auth.logout);
router.post('/regist', auth.register);

router.post('/user/insert', verifyToken, user.insertUser);
router.get('/user/:idUser', verifyToken, user.getUserById);
router.put('/user/update', verifyToken, user.updateUser);
router.get('/fakultas', user.getFakultas);

module.exports = router;
