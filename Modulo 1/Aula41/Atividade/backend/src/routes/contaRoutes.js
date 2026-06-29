const express = require('express');
const router = express.Router();
const {
  cadastrarConta,
  listarContas,
  buscarConta,
  atualizarConta,
} = require('../controllers/contaController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Listar e buscar: funcionário e cliente (cliente vê só as suas - filtro no controller)
router.get('/', listarContas);
router.get('/:id', buscarConta);

// Cadastrar e atualizar: apenas funcionário
router.post('/', roleMiddleware('funcionario'), cadastrarConta);
router.put('/:id', roleMiddleware('funcionario'), atualizarConta);

module.exports = router;
