const express = require('express');
const { getAll } = require('../controllers/crudController');
const { getOptions } = require('../controllers/clientsController');

const router = express.Router();
router.get('/', getAll('clients'));
router.get('/options', getOptions);

module.exports = router;