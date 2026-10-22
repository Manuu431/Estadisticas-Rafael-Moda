const express = require('express');
const { listPeriods, createPeriod, updatePeriod, skipPeriod, removePeriod } = require('../controllers/periodController');

const router = express.Router();
router.get('/', listPeriods('campaign'));
router.post('/', createPeriod('campaign'));
router.put('/:id', updatePeriod('campaign'));
router.patch('/:id/skip', skipPeriod('campaign'));
router.delete('/:id', removePeriod('campaign'));

module.exports = router;