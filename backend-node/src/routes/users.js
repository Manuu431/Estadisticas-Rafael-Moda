const express = require('express');
const { login, enterDemo } = require('../controllers/authController');

const router = express.Router();
router.post('/', login);
router.post('/demo', enterDemo);

module.exports = router;