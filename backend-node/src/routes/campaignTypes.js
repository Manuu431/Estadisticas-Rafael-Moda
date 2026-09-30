const express = require('express');
const { listTypes, createType, updateType, removeType, syncTypes } = require('../controllers/periodController');

const router = express.Router();
router.get('/', listTypes('campaign'));
router.post('/', createType('campaign'));
router.post('/sync', syncTypes('campaign'));
router.put('/:id', updateType('campaign'));
router.delete('/:id', removeType('campaign'));

module.exports = router;