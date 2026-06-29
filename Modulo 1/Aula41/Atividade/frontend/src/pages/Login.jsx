import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CadastroCliente from '../components/CadastroCliente';
import CadastroFuncionario from '../components/CadastroFuncionario';

export default function Login() {
  const { login, isAuthenticated, usuario } = useAuth();
  const navigate = useNavigate();

  const [modo, setModo] = useState('login'); // 'login' | 'cadastro'
  const [tipoCadastro, setTipoCadastro] = useState('cliente'); // 'cliente' | 'funcionario'

  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [avisoCadastro, setAvisoCadastro] = useState('');

  // Se já autenticado, redirecionar
  if (isAuthenticated) {
    return <Navigate to={usuario?.tipo === 'funcionario' ? '/funcionario' : '/cliente'} replace />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!form.email.trim() || !form.senha.trim()) {
      setErro('Preencha email e senha.');
      return;
    }

    setCarregando(true);
    try {
      const user = await login(form.email, form.senha);
      navigate(user.tipo === 'funcionario' ? '/funcionario' : '/cliente', { replace: true });
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Após cadastro bem-sucedido, faz login automaticamente
  const handleCadastroSucesso = async (dadosCadastro) => {
    setCarregando(true);
    try {
      const user = await login(dadosCadastro.email, dadosCadastro.senha);
      navigate(user.tipo === 'funcionario' ? '/funcionario' : '/cliente', { replace: true });
    } catch {
      setAvisoCadastro('Cadastro realizado! Faça login com seu e-mail e senha.');
      setModo('login');
      setForm({ email: dadosCadastro.email, senha: '' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: modo === 'login' ? 400 : 520 }}>
        <div className="login-logo">
          <h1> Honorato Bank</h1>
          <p>Sistema de Gestão Financeira</p>
        </div>

        {/* Abas: Entrar / Criar conta */}
        <div className="tabs" style={{ marginBottom: '1.25rem' }}>
          <button
            type="button"
            className={`tab-btn ${modo === 'login' ? 'active' : ''}`}
            onClick={() => { setModo('login'); setErro(''); }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`tab-btn ${modo === 'cadastro' ? 'active' : ''}`}
            onClick={() => { setModo('cadastro'); setErro(''); setAvisoCadastro(''); }}
          >
            Criar conta
          </button>
        </div>

        {modo === 'login' && (
          <>
            {avisoCadastro && <div className="alert alert-success">{avisoCadastro}</div>}

            <form onSubmit={handleSubmit} noValidate>
              {erro && <div className="alert alert-error">{erro}</div>}

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={carregando}
                style={{ marginTop: '0.5rem', padding: '0.75rem' }}
              >
                {carregando ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', textAlign: 'center', color: 'var(--gray-500)' }}>
              Não possui conta?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setModo('cadastro'); }}>
                Cadastre-se aqui
              </a>
            </p>
          </>
        )}

        {modo === 'cadastro' && (
          <div>
            {/* Sub-toggle: Cliente ou Funcionário */}
            <div className="form-group">
              <label>Eu sou:</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`btn ${tipoCadastro === 'cliente' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setTipoCadastro('cliente')}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  className={`btn ${tipoCadastro === 'funcionario' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setTipoCadastro('funcionario')}
                >
                  Funcionário
                </button>
              </div>
            </div>

            {tipoCadastro === 'cliente' ? (
              <CadastroCliente onSucesso={handleCadastroSucesso} />
            ) : (
              <CadastroFuncionario onSucesso={handleCadastroSucesso} />
            )}

            <p style={{ marginTop: '1rem', fontSize: '0.8rem', textAlign: 'center', color: 'var(--gray-500)' }}>
              Já tem uma conta?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setModo('login'); }}>
                Entrar
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
