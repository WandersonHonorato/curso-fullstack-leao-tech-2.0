const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const gerarToken = (usuario, tipo) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      tipo, // 'cliente' | 'funcionario'
      nome: usuario.nome,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    
  );
};

// POST /auth/login
// Busca o e-mail tanto em banco_clientes quanto em banco_funcionarios
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // 1) Tenta como cliente
    const { data: cliente } = await supabase
      .from('banco_clientes')
      .select('*')
      .eq('email', emailNormalizado)
      .single();

    if (cliente && cliente.senha) {
      const senhaValida = await bcrypt.compare(senha, cliente.senha);
      if (senhaValida) {
        if (cliente.status_ativo === false) {
          return res.status(403).json({ error: 'Cadastro inativo. Contate um funcionário.' });
        }
        const token = gerarToken(cliente, 'cliente');
        return res.json({
          token,
          usuario: {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            tipo: 'cliente',
          },
        });
      }
    }

    // 2) Tenta como funcionário
    const { data: funcionario } = await supabase
      .from('banco_funcionarios')
      .select('*')
      .eq('email', emailNormalizado)
      .single();

    if (funcionario && funcionario.senha) {
      const senhaValida = await bcrypt.compare(senha, funcionario.senha);
      if (senhaValida) {
        if (funcionario.status_ativo === false) {
          return res.status(403).json({ error: 'Cadastro inativo. Contate a administração.' });
        }
        const token = gerarToken(funcionario, 'funcionario');
        return res.json({
          token,
          usuario: {
            id: funcionario.id,
            nome: funcionario.nome,
            email: funcionario.email,
            tipo: 'funcionario',
          },
        });
      }
    }

    return res.status(401).json({ error: 'Email ou senha inválidos' });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /auth/cadastrar-cliente
// Rota pública: usada tanto pela tela de login (auto-cadastro) quanto
// pelo painel do funcionário (cadastro assistido).
const registrarCliente = async (req, res) => {
  try {
    const { nome, email, senha, cpf, telefone } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const { data: existenteCliente } = await supabase
      .from('banco_clientes')
      .select('id')
      .eq('email', emailNormalizado)
      .single();
    const { data: existenteFuncionario } = await supabase
      .from('banco_funcionarios')
      .select('id')
      .eq('email', emailNormalizado)
      .single();

    if (existenteCliente || existenteFuncionario) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const { data: novoCliente, error } = await supabase
      .from('banco_clientes')
      .insert([
        {
          nome: nome.trim(),
          email: emailNormalizado,
          senha: senhaHash,
          cpf: cpf || null,
          telefone: telefone || null,
          status_ativo: true,
        },
      ])
      .select('id, nome, email, cpf, telefone, status_ativo, data_cadastro')
      .single();

    if (error) {
      console.error('Erro ao cadastrar cliente:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }

    return res.status(201).json({
      message: 'Cliente cadastrado com sucesso',
      cliente: novoCliente,
    });
  } catch (error) {
    console.error('Erro ao registrar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /auth/cadastrar-funcionario
// Rota pública, disponível na tela de login (igual à de cliente).
// Aviso: em produção real isso normalmente exigiria aprovação/convite,
// mas foi deixado público aqui a pedido (cadastro direto na tela de login).
const registrarFuncionario = async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const { data: existenteCliente } = await supabase
      .from('banco_clientes')
      .select('id')
      .eq('email', emailNormalizado)
      .single();
    const { data: existenteFuncionario } = await supabase
      .from('banco_funcionarios')
      .select('id')
      .eq('email', emailNormalizado)
      .single();

    if (existenteCliente || existenteFuncionario) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const { data: novoFuncionario, error } = await supabase
      .from('banco_funcionarios')
      .insert([
        {
          nome: nome.trim(),
          email: emailNormalizado,
          senha: senhaHash,
          cargo: cargo || null,
          status_ativo: true,
        },
      ])
      .select('id, nome, email, cargo, status_ativo, data_admissao')
      .single();

    if (error) {
      console.error('Erro ao cadastrar funcionário:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
    }

    return res.status(201).json({
      message: 'Funcionário cadastrado com sucesso',
      funcionario: novoFuncionario,
    });
  } catch (error) {
    console.error('Erro ao registrar funcionário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /auth/me - retorna dados do usuário autenticado
const me = async (req, res) => {
  try {
    const tabela = req.usuario.tipo === 'funcionario' ? 'banco_funcionarios' : 'banco_clientes';
    const colunas =
      req.usuario.tipo === 'funcionario'
        ? 'id, nome, email, cargo, status_ativo, data_admissao'
        : 'id, nome, email, cpf, telefone, status_ativo, data_cadastro';

    const { data: usuario, error } = await supabase
      .from(tabela)
      .select(colunas)
      .eq('id', req.usuario.id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json({ usuario: { ...usuario, tipo: req.usuario.tipo } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { login, registrarCliente, registrarFuncionario, me };
