const express = require('express');
const router = express.Router();
const { login, registrarCliente, registrarFuncionario, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /auth/login - pública
router.post('/login', login);

// POST /auth/cadastrar-cliente - pública (usada na tela de login e no painel do funcionário)
router.post('/cadastrar-cliente', registrarCliente);

// POST /auth/cadastrar-funcionario - pública (usada na tela de login)
router.post('/cadastrar-funcionario', registrarFuncionario);

// GET /auth/me - autenticado
router.get('/me', authMiddleware, me);

module.exports = router;
