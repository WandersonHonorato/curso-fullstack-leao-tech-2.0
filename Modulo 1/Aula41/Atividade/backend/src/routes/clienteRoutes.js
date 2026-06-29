const express = require('express');
const router = express.Router();
const {
  listarClientes,
  buscarCliente,
  atualizarCliente,
  removerCliente,
} = require('../controllers/clienteController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Todas as rotas de clientes exigem autenticação de funcionário
router.use(authMiddleware);
router.use(roleMiddleware('funcionario'));

router.get('/', listarClientes);
router.get('/:id', buscarCliente);
router.put('/:id', atualizarCliente);
router.delete('/:id', removerCliente);

module.exports = router;
