import { useState, useEffect } from 'react';
import api from '../services/api';

const formatarValor = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export default function AtualizarConta({ onSucesso }) {
  const [contas, setContas] = useState([]);
  const [selecionada, setSelecionada] = useState('');
  const [form, setForm] = useState({ tipo_conta: 'corrente', status_ativo: true });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const carregarContas = () => {
    api.get('/contas').then(({ data }) => setContas(data.contas || []));
  };
  useEffect(carregarContas, []);

  const selecionarConta = (id) => {
    setSelecionada(id);
    const c = contas.find((c) => c.id === id);
    if (c) setForm({ tipo_conta: c.tipo_conta, status_ativo: c.status_ativo });
    setErro('');
    setSucesso('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selecionada) { setErro('Selecione uma conta.'); return; }

    setCarregando(true);
    try {
      await api.put(`/contas/${selecionada}`, form);
      setSucesso('Conta atualizada com sucesso!');
      carregarContas();
      onSucesso?.();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao atualizar conta');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Atualizar Conta</h3>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <div className="form-group">
        <label>Selecionar Conta</label>
        <select className="form-control" value={selecionada} onChange={(e) => selecionarConta(e.target.value)}>
          <option value="">Selecione uma conta</option>
          {contas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.banco_clientes?.nome} — Nº {c.numero_conta} | Saldo: {formatarValor(c.saldo)} | {c.status_ativo ? 'Ativa' : 'Inativa'}
            </option>
          ))}
        </select>
      </div>

      {selecionada && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Conta</label>
            <select className="form-control" value={form.tipo_conta} onChange={(e) => setForm((p) => ({ ...p, tipo_conta: e.target.value }))}>
              <option value="corrente">Conta Corrente</option>
              <option value="poupanca">Conta Poupança</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select className="form-control" value={form.status_ativo ? 'true' : 'false'} onChange={(e) => setForm((p) => ({ ...p, status_ativo: e.target.value === 'true' }))}>
              <option value="true">Ativa</option>
              <option value="false">Inativa</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      )}
    </div>
  );
}
