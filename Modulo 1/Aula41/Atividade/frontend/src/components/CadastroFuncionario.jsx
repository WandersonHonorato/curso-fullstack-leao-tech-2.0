import { useState } from 'react';
import api from '../services/api';

export default function CadastroFuncionario({ onSucesso, onCancelar }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', cargo: '' });
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
    if (form.senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/auth/cadastrar-funcionario', form);
      setSucesso('Funcionário cadastrado com sucesso!');
      onSucesso?.(form);
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao cadastrar funcionário');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Cadastrar Funcionário</h3>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome Completo *</label>
          <input name="nome" className="form-control" placeholder="Maria Souza" value={form.nome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>E-mail *</label>
          <input name="email" type="email" className="form-control" placeholder="maria@empresa.com" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Senha *</label>
          <input name="senha" type="password" className="form-control" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Cargo</label>
          <input name="cargo" className="form-control" placeholder="Ex: Atendente, Gerente" value={form.cargo} onChange={handleChange} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar Funcionário'}
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
