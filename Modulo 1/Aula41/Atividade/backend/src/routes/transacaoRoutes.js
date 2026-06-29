const express = require('express');
const router = express.Router();
const { extrato, extratoConta, transferencia } = require('../controllers/transacaoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Extrato geral (todas contas do usuário)
router.get('/extrato', roleMiddleware('cliente', 'funcionario'), extrato);

// Extrato de conta específica
router.get('/extrato/:conta_id', roleMiddleware('cliente', 'funcionario'), extratoConta);

// Transferência: apenas cliente
router.post('/transferencia', roleMiddleware('cliente'), transferencia);

module.exports = router;
