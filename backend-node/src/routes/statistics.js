const express = require('express');
const { getSummary, getDaily, getBrands } = require('../controllers/statisticsController');

const router = express.Router();
router.get('/summary', getSummary);
router.get('/daily', getDaily);
router.get('/brands', getBrands);

module.exports = router;
