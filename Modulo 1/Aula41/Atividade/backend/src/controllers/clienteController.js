const supabase = require('../config/supabase');

const COLUNAS = 'id, nome, email, cpf, telefone, status_ativo, data_cadastro';

// GET /clientes - lista todos os clientes (funcionário)
const listarClientes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('banco_clientes')
      .select(COLUNAS)
      .order('nome');

    if (error) throw error;

    return res.json({ clientes: data });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return res.status(500).json({ error: 'Erro ao listar clientes' });
  }
};

// GET /clientes/:id - busca cliente por ID (funcionário)
const buscarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('banco_clientes')
      .select(COLUNAS)
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    return res.json({ cliente: data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

// PUT /clientes/:id - atualizar cliente (funcionário)
const atualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, cpf, telefone, status_ativo } = req.body;

    const atualizacoes = {};
    if (nome) atualizacoes.nome = nome.trim();
    if (email) atualizacoes.email = email.toLowerCase().trim();
    if (cpf !== undefined) atualizacoes.cpf = cpf;
    if (telefone !== undefined) atualizacoes.telefone = telefone;
    if (status_ativo !== undefined) atualizacoes.status_ativo = status_ativo;

    const { data, error } = await supabase
      .from('banco_clientes')
      .update(atualizacoes)
      .eq('id', id)
      .select(COLUNAS)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Cliente não encontrado ou erro ao atualizar' });
    }

    return res.json({ message: 'Cliente atualizado com sucesso', cliente: data });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

// DELETE /clientes/:id - remover cliente (funcionário)
const removerCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('banco_clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover cliente:', error);
    return res.status(500).json({ error: 'Erro ao remover cliente' });
  }
};

module.exports = { listarClientes, buscarCliente, atualizarCliente, removerCliente };
