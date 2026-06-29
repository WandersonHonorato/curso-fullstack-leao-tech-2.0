const express = require('express');
const router = express.Router();
const {
  cadastrarServico,
  listarServicos,
  listarTodosServicos,
  atualizarServico,
  adquirirServico,
  listarServicosAdquiridos,
} = require('../controllers/servicoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Listar serviços ativos: todos autenticados
router.get('/', listarServicos);

// Listar todos (incluindo inativos): funcionário
router.get('/todos', roleMiddleware('funcionario'), listarTodosServicos);

// Serviços adquiridos pelo cliente
router.get('/adquiridos', roleMiddleware('cliente'), listarServicosAdquiridos);

// Adquirir serviço: apenas cliente
router.post('/:id/adquirir', roleMiddleware('cliente'), adquirirServico);

// Cadastrar e atualizar: apenas funcionário
router.post('/', roleMiddleware('funcionario'), cadastrarServico);
router.put('/:id', roleMiddleware('funcionario'), atualizarServico);

module.exports = router;
