import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CadastroCliente from '../components/CadastroCliente';
import CadastroConta from '../components/CadastroConta';
import CadastroServico from '../components/CadastroServico';
import AtualizarCliente from '../components/AtualizarCliente';
import AtualizarConta from '../components/AtualizarConta';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const formatarValor = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const TABS = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'cad-cliente', label: 'Cad. Cliente' },
  { id: 'cad-conta', label: 'Cad. Conta' },
  { id: 'cad-servico', label: 'Cad. Serviço' },
  { id: 'atualizar-cliente', label: 'Atualizar Cliente' },
  { id: 'atualizar-conta', label: 'Atualizar Conta' },
];

export default function FuncionarioDashboard() {
  const { usuario } = useAuth();
  const [aba, setAba] = useState('visao-geral');
  const [stats, setStats] = useState({ clientes: 0, contas: 0, servicos: 0 });
  const [clientes, setClientes] = useState([]);
  const [recarregar, setRecarregar] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get('/clientes'),
      api.get('/contas'),
      api.get('/servicos/todos'),
    ]).then(([c, ct, s]) => {
      setClientes(c.data.clientes || []);
      setStats({
        clientes: c.data.clientes?.length || 0,
        contas: ct.data.contas?.length || 0,
        servicos: s.data.servicos?.length || 0,
      });
    });
  }, [recarregar]);

  const recarregarTudo = () => setRecarregar((r) => r + 1);

  return (
    <>
      <Navbar links={[]} />
      <div className="page">
        <div className="container">

          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Painel do Funcionário</h1>
              <p className="page-subtitle">Olá, {usuario?.nome} — Gerencie clientes, Contas e Serviços</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ flexWrap: 'wrap' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${aba === t.id ? 'active' : ''}`}
                onClick={() => setAba(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Visão Geral */}
          {aba === 'visao-geral' && (
            <div>
              <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
                <div className="card stat-card">
                  <div className="stat-value">{stats.clientes}</div>
                  <div className="stat-label">Clientes Cadastrados</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-value">{stats.contas}</div>
                  <div className="stat-label">Contas Abertas</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-value">{stats.servicos}</div>
                  <div className="stat-label">Serviços Cadastrados</div>
                </div>
              </div>

              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Clientes Recentes</h3>
              {clientes.length === 0 ? (
                <div className="card empty">
                  <div className="empty-icon">👥</div>
                  <p>Nenhum cliente cadastrado ainda.</p>
                </div>
              ) : (
                <div className="card">
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>E-mail</th>
                          <th>CPF</th>
                          <th>Telefone</th>
                          <th>Cadastrado em</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientes.slice(0, 10).map((c) => (
                          <tr key={c.id}>
                            <td style={{ fontWeight: 500 }}>{c.nome}</td>
                            <td>{c.email}</td>
                            <td>{c.cpf || '—'}</td>
                            <td>{c.telefone || '—'}</td>
                            <td>{new Date(c.data_cadastro).toLocaleDateString('pt-BR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {aba === 'cad-cliente' && (
            <div className="card" style={{ maxWidth: 640 }}>
              <CadastroCliente onSucesso={recarregarTudo} />
            </div>
          )}

          {aba === 'cad-conta' && (
            <div className="card" style={{ maxWidth: 480 }}>
              <CadastroConta onSucesso={recarregarTudo} />
            </div>
          )}

          {aba === 'cad-servico' && (
            <div className="card" style={{ maxWidth: 480 }}>
              <CadastroServico onSucesso={recarregarTudo} />
            </div>
          )}

          {aba === 'atualizar-cliente' && (
            <div className="card" style={{ maxWidth: 640 }}>
              <AtualizarCliente onSucesso={recarregarTudo} />
            </div>
          )}

          {aba === 'atualizar-conta' && (
            <div className="card" style={{ maxWidth: 480 }}>
              <AtualizarConta onSucesso={recarregarTudo} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
