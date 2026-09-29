const express = require('express');
const { getAll, create, update, remove, syncType } = require('../controllers/crudController');

const router = express.Router();
router.get('/', getAll('season_types'));
router.post('/', create('season_types'));
router.post('/sync', syncType({ typeTable: 'season_types', targetTable: 'seasons', foreignKey: 'season_type_id' }));
router.put('/:id', update('season_types'));
router.delete('/:id', remove('season_types'));

module.exports = router;