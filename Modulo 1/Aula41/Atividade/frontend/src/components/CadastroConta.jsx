import { useState, useEffect } from 'react';
import api from '../services/api';

export default function CadastroConta({ onSucesso }) {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ cliente_id: '', tipo_conta: 'corrente', saldo_inicial: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    api.get('/clientes').then(({ data }) => setClientes(data.clientes || []));
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cliente_id) { setErro('Selecione um cliente.'); return; }

    setCarregando(true);
    try {
      const { data } = await api.post('/contas', {
        ...form,
        saldo_inicial: parseFloat(form.saldo_inicial) || 0,
      });
      setSucesso(`Conta ${data.conta.numero_conta} cadastrada com sucesso!`);
      setForm({ cliente_id: '', tipo_conta: 'corrente', saldo_inicial: '' });
      onSucesso?.();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao cadastrar conta');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Cadastrar Nova Conta</h3>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Cliente *</label>
          <select name="cliente_id" className="form-control" value={form.cliente_id} onChange={handleChange} required>
            <option value="">Selecione o cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome} — {c.email}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tipo de Conta</label>
          <select name="tipo_conta" className="form-control" value={form.tipo_conta} onChange={handleChange}>
            <option value="corrente">Conta Corrente</option>
            <option value="poupanca">Conta Poupança</option>
          </select>
        </div>

        <div className="form-group">
          <label>Saldo Inicial (R$)</label>
          <input
            name="saldo_inicial"
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            placeholder="0,00"
            value={form.saldo_inicial}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar Conta'}
        </button>
      </form>
    </div>
  );
}
