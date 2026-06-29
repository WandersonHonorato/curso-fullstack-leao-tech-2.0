import { useState, useEffect } from 'react';
import api from '../services/api';

const formatarValor = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export default function ServicosList({ onSucesso }) {
  const [servicos, setServicos] = useState([]);
  const [contas, setContas] = useState([]);
  const [servicosAdquiridos, setServicosAdquiridos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [adquirindo, setAdquirindo] = useState(null);
  const [contaSelecionada, setContaSelecionada] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregar = () => {
    Promise.all([
      api.get('/servicos'),
      api.get('/contas'),
      api.get('/servicos/adquiridos'),
    ])
      .then(([s, c, sa]) => {
        setServicos(s.data.servicos || []);
        setContas(c.data.contas || []);
        setServicosAdquiridos(sa.data.servicos_adquiridos?.map((sa) => sa.servico_id) || []);
        if (c.data.contas?.length > 0) setContaSelecionada(c.data.contas[0].id);
      })
      .catch(() => setErro('Erro ao carregar serviços'))
      .finally(() => setCarregando(false));
  };

  useEffect(carregar, []);

  const adquirir = async (servicoId) => {
    if (!contaSelecionada) { setErro('Selecione uma conta primeiro.'); return; }
    setAdquirindo(servicoId);
    setErro('');
    setSucesso('');
    try {
      const { data } = await api.post(`/servicos/${servicoId}/adquirir`, { conta_id: contaSelecionada });
      setSucesso(data.message);
      setServicosAdquiridos((prev) => [...prev, servicoId]);
      onSucesso?.();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao adquirir serviço');
    } finally {
      setAdquirindo(null);
    }
  };

  if (carregando) return <div className="loader"><div className="spinner" />Carregando...</div>;

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Serviços Disponíveis</h3>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      {contas.length > 0 && (
        <div className="form-group" style={{ maxWidth: 360, marginBottom: '1.25rem' }}>
          <label>Débitar na conta:</label>
          <select className="form-control" value={contaSelecionada} onChange={(e) => setContaSelecionada(e.target.value)}>
            {contas.map((c) => (
              <option key={c.id} value={c.id}>
                Conta {c.numero_conta} — Saldo: {formatarValor(c.saldo)}
              </option>
            ))}
          </select>
        </div>
      )}

      {servicos.length === 0 ? (
        <div className="empty"><div className="empty-icon">📦</div><p>Nenhum serviço disponível.</p></div>
      ) : (
        <div className="grid grid-3">
          {servicos.map((s) => {
            const jaAdquirido = servicosAdquiridos.includes(s.id);
            return (
              <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>{s.nome_servico}</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{s.descricao}</div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {formatarValor(s.taxa_mensal)}
                </div>
                {jaAdquirido ? (
                  <span className="badge badge-green" style={{ alignSelf: 'flex-start' }}>✓ Adquirido</span>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => adquirir(s.id)}
                    disabled={adquirindo === s.id || !contaSelecionada}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {adquirindo === s.id ? 'Processando...' : 'Adquirir'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
