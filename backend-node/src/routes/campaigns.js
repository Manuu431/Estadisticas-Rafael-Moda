const express = require('express');
const { getAll, create, update, remove } = require('../controllers/crudController');

const router = express.Router();
router.get('/', getAll('campaigns'));
router.post('/', create('campaigns'));
router.put('/:id', update('campaigns'));
router.delete('/:id', remove('campaigns'));

module.exports = router;