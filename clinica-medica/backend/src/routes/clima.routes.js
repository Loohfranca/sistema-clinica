const router = require('express').Router();
const { previsao } = require('../controllers/clima.controller');

router.get('/', previsao);

module.exports = router;
