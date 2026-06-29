import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AtualizarCliente({ onSucesso }) {
  const [clientes, setClientes] = useState([]);
  const [selecionado, setSelecionado] = useState('');
  const [form, setForm] = useState({ nome: '', email: '', cpf: '', telefone: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const carregarClientes = () => {
    api.get('/clientes').then(({ data }) => setClientes(data.clientes || []));
  };
  useEffect(carregarClientes, []);

  const selecionarCliente = (id) => {
    setSelecionado(id);
    const c = clientes.find((c) => c.id === id);
    if (c) setForm({ nome: c.nome, email: c.email, cpf: c.cpf || '', telefone: c.telefone || '' });
    setErro('');
    setSucesso('');
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selecionado) { setErro('Selecione um cliente.'); return; }

    setCarregando(true);
    try {
      await api.put(`/clientes/${selecionado}`, form);
      setSucesso('Cliente atualizado com sucesso!');
      carregarClientes();
      onSucesso?.();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao atualizar cliente');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Atualizar Cadastro do Cliente</h3>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <div className="form-group">
        <label>Selecionar Cliente</label>
        <select className="form-control" value={selecionado} onChange={(e) => selecionarCliente(e.target.value)}>
          <option value="">Selecione um cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome} — {c.email}</option>
          ))}
        </select>
      </div>

      {selecionado && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Nome</label>
              <input name="nome" className="form-control" value={form.nome} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>CPF</label>
              <input name="cpf" className="form-control" value={form.cpf} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input name="telefone" className="form-control" value={form.telefone} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      )}
    </div>
  );
}
