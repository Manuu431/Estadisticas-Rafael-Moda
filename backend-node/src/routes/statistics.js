const express = require('express');
const { getSummary, getDaily, getBrands, getCompare } = require('../controllers/statisticsController');

const router = express.Router();
router.get('/summary', getSummary);
router.get('/daily', getDaily);
router.get('/brands', getBrands);
router.get('/compare', getCompare);

module.exports = router;
