const express = require('express');
const { getAll } = require('../controllers/crudController');

const router = express.Router();
router.get('/', getAll('products'));

module.exports = router;