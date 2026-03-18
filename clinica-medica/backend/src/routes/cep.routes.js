const router = require('express').Router();
const { buscarCep } = require('../controllers/cep.controller');

router.get('/:cep', buscarCep);

module.exports = router;
