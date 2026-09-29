const express = require('express');
const { getAll, create, update, remove } = require('../controllers/crudController');

const router = express.Router();
router.get('/', getAll('seasons'));
router.post('/', create('seasons'));
router.put('/:id', update('seasons'));
router.delete('/:id', remove('seasons'));

module.exports = router;