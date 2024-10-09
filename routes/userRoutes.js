const express = require('express');
const router = express.Router();
const { registerUser, loginUser, authUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/auth', authUser);

module.exports = router;
