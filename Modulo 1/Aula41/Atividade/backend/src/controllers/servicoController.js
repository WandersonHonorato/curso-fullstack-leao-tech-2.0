const supabase = require('../config/supabase');

// POST /servicos - cadastrar serviço (funcionário)
const cadastrarServico = async (req, res) => {
  try {
    const { nome_servico, descricao, taxa_mensal } = req.body;

    if (!nome_servico || !taxa_mensal) {
      return res.status(400).json({ error: 'Nome e taxa mensal são obrigatórios' });
    }

    const { data, error } = await supabase
      .from('banco_servicos')
      .insert([
        {
          nome_servico: nome_servico.trim(),
          descricao: descricao || '',
          taxa_mensal: parseFloat(taxa_mensal),
          status_ativo: true,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao cadastrar serviço:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar serviço' });
    }

    return res.status(201).json({ message: 'Serviço cadastrado com sucesso', servico: data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET servicos - listar serviços disponíveis (todos autenticados)
const listarServicos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('banco_servicos')
      .select('*')
      .eq('status_ativo', true)
      .order('nome_servico');

    if (error) throw error;

    return res.json({ servicos: data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar serviços' });
  }
};

// GET servicos - listar todos incluindo inativos (funcionário)
const listarTodosServicos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('banco_servicos')
      .select('*')
      .order('nome_servico');

    if (error) throw error;

    return res.json({ servicos: data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar serviços' });
  }
};

// PUT /servicos/:id - atualizar serviço (funcionário)
const atualizarServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_servico, descricao, taxa_mensal, status_ativo } = req.body;

    const atualizacoes = {};
    if (nome_servico !== undefined) atualizacoes.nome_servico = nome_servico.trim();
    if (descricao !== undefined) atualizacoes.descricao = descricao;
    if (taxa_mensal !== undefined) atualizacoes.taxa_mensal = parseFloat(taxa_mensal);
    if (status_ativo !== undefined) atualizacoes.status_ativo = status_ativo;

    const { data, error } = await supabase
      .from('banco_servicos')
      .update(atualizacoes)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    return res.json({ message: 'Serviço atualizado com sucesso', servico: data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
};

// POST /servicos/:id/adquirir - cliente contrata um serviço
const adquirirServico = async (req, res) => {
  try {
    const { id: servico_id } = req.params;
    const { conta_id } = req.body;
    const cliente_id = req.usuario.id;

    if (!conta_id) {
      return res.status(400).json({ error: 'ID da conta é obrigatório' });
    }

    // Verificar se serviço existe e está ativo
    const { data: servico, error: erroServico } = await supabase
      .from('banco_servicos')
      .select('*')
      .eq('id', servico_id)
      .eq('status_ativo', true)
      .single();

    if (erroServico || !servico) {
      return res.status(404).json({ error: 'Serviço não encontrado ou indisponível' });
    }

    // Verificar conta do cliente e saldo
    const { data: conta, error: erroConta } = await supabase
      .from('banco_contas')
      .select('*')
      .eq('id', conta_id)
      .eq('cliente_id', cliente_id)
      .eq('status_ativo', true)
      .single();

    if (erroConta || !conta) {
      return res.status(404).json({ error: 'Conta não encontrada ou inativa' });
    }

    if (parseFloat(conta.saldo) < parseFloat(servico.taxa_mensal)) {
      return res.status(400).json({ error: 'Saldo insuficiente para contratar este serviço' });
    }

    // Verificar se já contratou este serviço (e está ativa)
    const { data: jaContratado } = await supabase
      .from('banco_contratacoes')
      .select('id')
      .eq('cliente_id', cliente_id)
      .eq('servico_id', servico_id)
      .eq('status_contratacao', 'ativa')
      .single();

    if (jaContratado) {
      return res.status(409).json({ error: 'Você já contratou este serviço' });
    }

    // Debitar valor da conta
    const novoSaldo = parseFloat(conta.saldo) - parseFloat(servico.taxa_mensal);
    await supabase.from('banco_contas').update({ saldo: novoSaldo }).eq('id', conta_id);

    // Registrar contratação
    const { data: contratacao } = await supabase
      .from('banco_contratacoes')
      .insert([
        {
          cliente_id,
          servico_id,
          status_contratacao: 'ativa',
          observacao: `Débito inicial na conta ${conta.numero_conta}`,
        },
      ])
      .select('*')
      .single();

    // Registrar transação (débito da taxa na conta escolhida)
    await supabase.from('banco_transacoes').insert([
      {
        conta_id,
        tipo_transacao: 'servico',
        valor: servico.taxa_mensal,
        descricao: `Contratação do serviço: ${servico.nome_servico}`,
      },
    ]);

    return res.status(201).json({
      message: `Serviço "${servico.nome_servico}" contratado com sucesso`,
      contratacao,
      saldo_atual: novoSaldo,
    });
  } catch (error) {
    console.error('Erro ao contratar serviço:', error);
    return res.status(500).json({ error: 'Erro ao contratar serviço' });
  }
};

// GET /servicos/adquiridos - serviços contratados pelo cliente
const listarServicosAdquiridos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('banco_contratacoes')
      .select('*, banco_servicos(nome_servico, descricao, taxa_mensal)')
      .eq('cliente_id', req.usuario.id)
      .order('data_contratacao', { ascending: false });

    if (error) throw error;

    return res.json({ servicos_adquiridos: data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar serviços contratados' });
  }
};

module.exports = {
  cadastrarServico,
  listarServicos,
  listarTodosServicos,
  atualizarServico,
  adquirirServico,
  listarServicosAdquiridos,
};
