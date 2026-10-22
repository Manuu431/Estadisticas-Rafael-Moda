const express = require('express');
const { getOptions, listSales } = require('../controllers/salesController');

const router = express.Router();
router.get('/', listSales);
router.get('/options', getOptions);

module.exports = router;