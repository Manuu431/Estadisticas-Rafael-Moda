const express = require('express');
const { listPeriods, createPeriod, updatePeriod, removePeriod } = require('../controllers/periodController');

const router = express.Router();
router.get('/', listPeriods('campaign'));
router.post('/', createPeriod('campaign'));
router.put('/:id', updatePeriod('campaign'));
router.delete('/:id', removePeriod('campaign'));

module.exports = router;