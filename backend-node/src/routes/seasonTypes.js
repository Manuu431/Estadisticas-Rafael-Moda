const express = require('express');
const { listTypes, createType, updateType, removeType, syncTypes } = require('../controllers/periodController');

const router = express.Router();
router.get('/', listTypes('season'));
router.post('/', createType('season'));
router.post('/sync', syncTypes('season'));
router.put('/:id', updateType('season'));
router.delete('/:id', removeType('season'));

module.exports = router;