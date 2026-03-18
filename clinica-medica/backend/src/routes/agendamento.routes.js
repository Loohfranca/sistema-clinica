const router = require('express').Router();
const ctrl = require('../controllers/agendamento.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');

router.get('/verificar', auth, ctrl.verificarHorario);
router.post('/', auth, ctrl.criar);
router.get('/meus', auth, ctrl.meus);
router.get('/todos', auth, admin, ctrl.todos);
router.patch('/:id/status', auth, admin, ctrl.atualizarStatus);
router.patch('/:id/cancelar', auth, ctrl.cancelar);

module.exports = router;
