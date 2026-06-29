import { useState, useEffect } from 'react';
import api from '../services/api';

const formatarValor = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export default function Transferencia({ onSucesso }) {
  const [contas, setContas] = useState([]);
  const [form, setForm] = useState({ conta_origem_id: '', numero_conta_destino: '', valor: '', descricao: '' });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    api.get('/contas').then(({ data }) => setContas(data.contas || []));
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErro('');
    setSucesso('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.conta_origem_id || !form.numero_conta_destino || !form.valor) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    setCarregando(true);
    try {
      const { data } = await api.post('/transacoes/transferencia', {
        ...form,
        valor: parseFloat(form.valor),
      });
      setSucesso(`Transferência realizada! Saldo atual: ${formatarValor(data.saldo_atual)}`);
      setForm({ conta_origem_id: '', numero_conta_destino: '', valor: '', descricao: '' });
      onSucesso?.();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao realizar transferência');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Nova Transferência</h3>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Conta de Origem *</label>
          <select name="conta_origem_id" className="form-control" value={form.conta_origem_id} onChange={handleChange} required>
            <option value="">Selecione a conta de origem</option>
            {contas.map((c) => (
              <option key={c.id} value={c.id}>
                Ag. {c.agencia} | Conta {c.numero_conta} — Saldo: {formatarValor(c.saldo)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Número da Conta de Destino *</label>
          <input
            name="numero_conta_destino"
            className="form-control"
            placeholder="Ex: 1234567-8"
            value={form.numero_conta_destino}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Valor (R$) *</label>
          <input
            name="valor"
            type="number"
            min="0.01"
            step="0.01"
            className="form-control"
            placeholder="0,00"
            value={form.valor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição (opcional)</label>
          <input
            name="descricao"
            className="form-control"
            placeholder="Ex: Pagamento de aluguel"
            value={form.descricao}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={carregando}>
          {carregando ? 'Transferindo...' : 'Realizar Transferência'}
        </button>
      </form>
    </div>
  );
}
