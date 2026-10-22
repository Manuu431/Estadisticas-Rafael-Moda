const express = require('express');
const { listPeriods, createPeriod, updatePeriod, skipPeriod, removePeriod } = require('../controllers/periodController');

const router = express.Router();
router.get('/', listPeriods('season'));
router.post('/', createPeriod('season'));
router.put('/:id', updatePeriod('season'));
router.patch('/:id/skip', skipPeriod('season'));
router.delete('/:id', removePeriod('season'));

module.exports = router;