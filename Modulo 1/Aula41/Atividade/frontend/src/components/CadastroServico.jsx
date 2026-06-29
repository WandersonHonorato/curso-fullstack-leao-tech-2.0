import { useState } from 'react';
import api from '../services/api';

export default function CadastroServico({ onSucesso }) {
  const [form, setForm] = useState({ nome_servico: '', descricao: '', taxa_mensal: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome_servico || !form.taxa_mensal) { setErro('Nome e taxa mensal são obrigatórios.'); return; }

    setCarregando(true);
    try {
      await api.post('/servicos', { ...form, taxa_mensal: parseFloat(form.taxa_mensal) });
      setSucesso('Serviço cadastrado com sucesso!');
      setForm({ nome_servico: '', descricao: '', taxa_mensal: '' });
      onSucesso?.();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao cadastrar serviço');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Cadastrar Novo Serviço</h3>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome do Serviço *</label>
          <input name="nome_servico" className="form-control" placeholder="Ex: Seguro de vida" value={form.nome_servico} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <textarea
            name="descricao"
            className="form-control"
            placeholder="Descreva o serviço..."
            value={form.descricao}
            onChange={handleChange}
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>
        <div className="form-group">
          <label>Taxa Mensal (R$) *</label>
          <input
            name="taxa_mensal"
            type="number"
            min="0.01"
            step="0.01"
            className="form-control"
            placeholder="0,00"
            value={form.taxa_mensal}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar Serviço'}
        </button>
      </form>
    </div>
  );
}
