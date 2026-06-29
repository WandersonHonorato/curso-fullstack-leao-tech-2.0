import { useState } from 'react';
import api from '../services/api';

export default function CadastroCliente({ onSucesso, onCancelar }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', cpf: '', telefone: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.senha) {
      setErro('Nome, email e senha são obrigatórios.');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/auth/cadastrar-cliente', form);
      setSucesso('Cliente cadastrado com sucesso!');
      onSucesso?.(form);
      setForm({ nome: '', email: '', senha: '', cpf: '', telefone: '' });
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao cadastrar cliente');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Cadastrar Novo Cliente</h3>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Nome Completo *</label>
            <input name="nome" className="form-control" placeholder="João da Silva" value={form.nome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>E-mail *</label>
            <input name="email" type="email" className="form-control" placeholder="joao@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Senha *</label>
            <input name="senha" type="password" className="form-control" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input name="cpf" className="form-control" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input name="telefone" className="form-control" placeholder="(00) 00000-0000" value={form.telefone} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar Cliente'}
          </button>
          {onCancelar && (
            <button type="button" className="btn btn-outline" onClick={onCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
