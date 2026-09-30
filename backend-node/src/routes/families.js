const express = require('express');
const { getAll } = require('../controllers/crudController');

const router = express.Router();
router.get('/', getAll('families'));

module.exports = router;