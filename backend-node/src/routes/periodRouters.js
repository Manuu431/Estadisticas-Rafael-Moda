const express = require('express');
const { listPeriods, createPeriod, updatePeriod, skipPeriod, removePeriod, listTypes, createType, updateType, removeType, syncTypes } = require('../controllers/periodController');

function periodRouter(kind) {
  const router = express.Router();
  router.get('/', listPeriods(kind));
  router.post('/', createPeriod(kind));
  router.put('/:id', updatePeriod(kind));
  router.patch('/:id/skip', skipPeriod(kind));
  router.delete('/:id', removePeriod(kind));
  return router;
}

function typeRouter(kind) {
  const router = express.Router();
  router.get('/', listTypes(kind));
  router.post('/', createType(kind));
  router.post('/sync', syncTypes(kind));
  router.put('/:id', updateType(kind));
  router.delete('/:id', removeType(kind));
  return router;
}

module.exports = { periodRouter, typeRouter };