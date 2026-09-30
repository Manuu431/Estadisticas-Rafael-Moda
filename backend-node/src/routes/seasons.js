const express = require('express');
const { listPeriods, createPeriod, updatePeriod, removePeriod } = require('../controllers/periodController');

const router = express.Router();
router.get('/', listPeriods('season'));
router.post('/', createPeriod('season'));
router.put('/:id', updatePeriod('season'));
router.delete('/:id', removePeriod('season'));

module.exports = router;