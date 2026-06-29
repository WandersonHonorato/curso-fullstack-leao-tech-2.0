import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ServicosList from '../components/ServicosList';
import Extrato from '../components/Extrato';
import Transferencia from '../components/Transferencia';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const formatarValor = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const TABS = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'extrato', label: 'Extrato' },
  { id: 'transferencia', label: 'Transferência' },
];

export default function ClienteDashboard() {
  const { usuario } = useAuth();
  const [aba, setAba] = useState('visao-geral');
  const [contas, setContas] = useState([]);
  const [recarregar, setRecarregar] = useState(0);

  const carregarContas = () => {
    api.get('/contas').then(({ data }) => setContas(data.contas || []));
  };

  useEffect(carregarContas, [recarregar]);

  const saldoTotal = contas.reduce((acc, c) => acc + parseFloat(c.saldo || 0), 0);

  const navLinks = TABS.map((t) => ({ path: '#', label: t.label }));

  return (
    <>
      <Navbar links={[]} />
      <div className="page">
        <div className="container">

          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Olá, {usuario?.nome?.split(' ')[0]} </h1>
              <p className="page-subtitle">Área do Cliente</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
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

          {/* Conteúdo */}
          {aba === 'visao-geral' && (
            <div>
              <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
                <div className="card stat-card">
                  <div className="stat-value">{formatarValor(saldoTotal)}</div>
                  <div className="stat-label">Saldo Total</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-value">{contas.length}</div>
                  <div className="stat-label">Contas Ativas</div>
                </div>
              </div>

              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Minhas Contas</h3>
              {contas.length === 0 ? (
                <div className="card empty">
                  <div className="empty-icon">🏦</div>
                  <p>Você ainda não possui contas. Entre em contato com um funcionário do Honorato Bank.</p>
                </div>
              ) : (
                <div className="grid grid-2">
                  {contas.map((c) => (
                    <div key={c.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>Conta {c.tipo_conta === 'poupanca' ? 'Poupança' : 'Corrente'}</div>
                          <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                            Ag. {c.agencia} | Nº {c.numero_conta}
                          </div>
                        </div>
                        <span className={`badge ${c.status_ativo ? 'badge-green' : 'badge-red'}`}>
                          {c.status_ativo ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <div style={{ marginTop: '1rem' }}>
                        <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Saldo disponível</div>
                        <div className="saldo-value">{formatarValor(c.saldo)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {aba === 'servicos' && (
            <div className="card">
              <ServicosList onSucesso={() => setRecarregar((r) => r + 1)} />
            </div>
          )}

          {aba === 'extrato' && (
            <div className="card">
              <Extrato />
            </div>
          )}

          {aba === 'transferencia' && (
            <div className="card" style={{ maxWidth: 560 }}>
              <Transferencia onSucesso={() => setRecarregar((r) => r + 1)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
