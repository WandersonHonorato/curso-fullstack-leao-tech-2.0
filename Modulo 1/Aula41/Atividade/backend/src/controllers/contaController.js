const supabase = require('../config/supabase');

// Gera número de conta aleatório
const gerarNumeroConta = () => {
  const num = Math.floor(Math.random() * 9000000) + 1000000;
  return `${num}-${Math.floor(Math.random() * 9)}`;
};

// POST /contas - cadastrar conta (funcionário)
const cadastrarConta = async (req, res) => {
  try {
    const { cliente_id, tipo_conta, saldo_inicial } = req.body;

    if (!cliente_id) {
      return res.status(400).json({ error: 'ID do cliente é obrigatório' });
    }

    // Verificar se cliente existe
    const { data: cliente } = await supabase
      .from('banco_clientes')
      .select('id, nome')
      .eq('id', cliente_id)
      .single();

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const numeroConta = gerarNumeroConta();

    const { data, error } = await supabase
      .from('banco_contas')
      .insert([
        {
          cliente_id,
          numero_conta: numeroConta,
          tipo_conta: tipo_conta || 'corrente',
          saldo: saldo_inicial || 0,
          agencia: '0001',
          status_ativo: true,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao cadastrar conta:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar conta' });
    }

    return res.status(201).json({ message: 'Conta cadastrada com sucesso', conta: data });
  } catch (error) {
    console.error('Erro ao cadastrar conta:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /contas - listar contas (funcionário vê todas, cliente vê as suas)
const listarContas = async (req, res) => {
  try {
    let query = supabase
      .from('banco_contas')
      .select('*, banco_clientes(nome, email)')
      .order('data_abertura', { ascending: false });

    // Cliente só vê as próprias contas
    if (req.usuario.tipo === 'cliente') {
      query = query.eq('cliente_id', req.usuario.id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({ contas: data });
  } catch (error) {
    console.error('Erro ao listar contas:', error);
    return res.status(500).json({ error: 'Erro ao listar contas' });
  }
};

// GET /contas/:id - buscar conta por ID
const buscarConta = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('banco_contas')
      .select('*, banco_clientes(nome, email)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    // Cliente só pode ver as próprias contas
    if (req.usuario.tipo === 'cliente' && data.cliente_id !== req.usuario.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    return res.json({ conta: data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar conta' });
  }
};

// PUT /contas/:id - atualizar conta (funcionário)
const atualizarConta = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_conta, status_ativo } = req.body;

    const atualizacoes = {};
    if (tipo_conta !== undefined) atualizacoes.tipo_conta = tipo_conta;
    if (status_ativo !== undefined) atualizacoes.status_ativo = status_ativo;

    const { data, error } = await supabase
      .from('banco_contas')
      .update(atualizacoes)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    return res.json({ message: 'Conta atualizada com sucesso', conta: data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar conta' });
  }
};

module.exports = { cadastrarConta, listarContas, buscarConta, atualizarConta };
