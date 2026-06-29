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
          <h1><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-coin" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/>
  <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z"/>
  <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z"/>
  <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567"/>
</svg> Honorato Bank</h1>
          <p>Banco Sistema Financeiro</p>
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
