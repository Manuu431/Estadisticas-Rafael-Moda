const express = require('express');
const { getAll, create, update, remove, syncType } = require('../controllers/crudController');

const router = express.Router();
router.get('/', getAll('campaign_types'));
router.post('/', create('campaign_types'));
router.post('/sync', syncType({ typeTable: 'campaign_types', targetTable: 'campaigns', foreignKey: 'campaign_type_id' }));
router.put('/:id', update('campaign_types'));
router.delete('/:id', remove('campaign_types'));

module.exports = router;