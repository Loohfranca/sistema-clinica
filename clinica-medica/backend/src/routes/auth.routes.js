const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const middleware = require('../middleware/auth.middleware');

router.post('/cadastrar', auth.cadastrar);
router.post('/login', auth.login);
router.get('/perfil', middleware, auth.perfil);

module.exports = router;
