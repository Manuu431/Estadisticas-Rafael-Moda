const express = require('express');
const { getAll } = require('../controllers/crudController');
const { getOptions } = require('../controllers/salesController');

const router = express.Router();
router.get('/', getAll('sales'));
router.get('/options', getOptions);

module.exports = router;