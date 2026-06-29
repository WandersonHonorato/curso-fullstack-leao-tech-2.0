const supabase = require('../config/supabase');

// GET /transacoes/extrato - extrato do cliente (próprias contas)
const extrato = async (req, res) => {
  try {
    const cliente_id = req.usuario.id;

    // Buscar contas do usuário (ou todas, se funcionário)
    let contasQuery = supabase.from('banco_contas').select('id');
    if (req.usuario.tipo === 'cliente') {
      contasQuery = contasQuery.eq('cliente_id', cliente_id);
    }
    const { data: contas } = await contasQuery;

    if (!contas || contas.length === 0) {
      return res.json({ transacoes: [] });
    }

    const contaIds = contas.map((c) => c.id);

    // banco_transacoes tem apenas uma conta_id por registro
    const { data: transacoes, error } = await supabase
      .from('banco_transacoes')
      .select(`
        *,
        banco_contas(numero_conta, banco_clientes(nome))
      `)
      .in('conta_id', contaIds)
      .order('data_transacao', { ascending: false })
      .limit(50);

    if (error) throw error;

    return res.json({ transacoes });
  } catch (error) {
    console.error('Erro ao buscar extrato:', error);
    return res.status(500).json({ error: 'Erro ao buscar extrato' });
  }
};

// GET /transacoes/extrato/:conta_id - extrato de uma conta específica
const extratoConta = async (req, res) => {
  try {
    const { conta_id } = req.params;
    const cliente_id = req.usuario.id;

    // Verificar se conta pertence ao usuário (cliente) ou é funcionário
    if (req.usuario.tipo === 'cliente') {
      const { data: conta } = await supabase
        .from('banco_contas')
        .select('id')
        .eq('id', conta_id)
        .eq('cliente_id', cliente_id)
        .single();

      if (!conta) {
        return res.status(403).json({ error: 'Acesso negado a esta conta' });
      }
    }

    const { data: transacoes, error } = await supabase
      .from('banco_transacoes')
      .select('*, banco_contas(numero_conta)')
      .eq('conta_id', conta_id)
      .order('data_transacao', { ascending: false })
      .limit(50);

    if (error) throw error;

    return res.json({ transacoes });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar extrato' });
  }
};

// POST /transacoes/transferencia - realizar transferência
// O schema banco_transacoes tem uma única conta_id (não tem conta
// origem/destino separadas), então uma transferência gera DUAS linhas:
// um débito na conta de origem e um crédito na conta de destino.
const transferencia = async (req, res) => {
  try {
    const { conta_origem_id, numero_conta_destino, valor, descricao } = req.body;
    const cliente_id = req.usuario.id;

    if (!conta_origem_id || !numero_conta_destino || !valor) {
      return res.status(400).json({
        error: 'Conta de origem, conta de destino e valor são obrigatórios',
      });
    }

    const valorNum = parseFloat(valor);
    if (valorNum <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' });
    }

    // Verificar conta de origem (pertence ao usuário)
    const { data: contaOrigem } = await supabase
      .from('banco_contas')
      .select('*')
      .eq('id', conta_origem_id)
      .eq('cliente_id', cliente_id)
      .eq('status_ativo', true)
      .single();

    if (!contaOrigem) {
      return res.status(404).json({ error: 'Conta de origem não encontrada ou inativa' });
    }

    if (parseFloat(contaOrigem.saldo) < valorNum) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Buscar conta de destino pelo número
    const { data: contaDestino } = await supabase
      .from('banco_contas')
      .select('*')
      .eq('numero_conta', numero_conta_destino)
      .eq('status_ativo', true)
      .single();

    if (!contaDestino) {
      return res.status(404).json({ error: 'Conta de destino não encontrada' });
    }

    if (contaOrigem.id === contaDestino.id) {
      return res.status(400).json({ error: 'Não é possível transferir para a mesma conta' });
    }

    // Atualizar saldos
    const novoSaldoOrigem = parseFloat(contaOrigem.saldo) - valorNum;
    const novoSaldoDestino = parseFloat(contaDestino.saldo) + valorNum;

    await Promise.all([
      supabase.from('banco_contas').update({ saldo: novoSaldoOrigem }).eq('id', contaOrigem.id),
      supabase.from('banco_contas').update({ saldo: novoSaldoDestino }).eq('id', contaDestino.id),
    ]);

    // Registrar as duas pontas da transação
    const { data: transacao, error } = await supabase
      .from('banco_transacoes')
      .insert([
        {
          conta_id: contaOrigem.id,
          tipo_transacao: 'transferencia_enviada',
          valor: valorNum,
          descricao: descricao || `Transferência enviada para conta ${numero_conta_destino}`,
        },
        {
          conta_id: contaDestino.id,
          tipo_transacao: 'transferencia_recebida',
          valor: valorNum,
          descricao: descricao || `Transferência recebida da conta ${contaOrigem.numero_conta}`,
        },
      ])
      .select('*');

    if (error) throw error;

    return res.status(201).json({
      message: 'Transferência realizada com sucesso',
      transacao: transacao?.[0],
      saldo_atual: novoSaldoOrigem,
    });
  } catch (error) {
    console.error('Erro na transferência:', error);
    return res.status(500).json({ error: 'Erro ao realizar transferência' });
  }
};

module.exports = { extrato, extratoConta, transferencia };
