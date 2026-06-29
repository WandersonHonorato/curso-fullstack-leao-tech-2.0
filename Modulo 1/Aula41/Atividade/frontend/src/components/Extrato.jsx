import { useState, useEffect } from 'react';
import api from '../services/api';

const formatarValor = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const formatarData = (data) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(data));

const tipoConfig = {
  transferencia_enviada: { label: 'Transferência enviada', badge: 'badge-red' },
  transferencia_recebida: { label: 'Transferência recebida', badge: 'badge-green' },
  servico: { label: 'Serviço', badge: 'badge-yellow' },
  deposito: { label: 'Depósito', badge: 'badge-green' },
  saque: { label: 'Saque', badge: 'badge-red' },
  tarifa: { label: 'Tarifa', badge: 'badge-red' },
};

export default function Extrato({ contaId }) {
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const url = contaId ? `/transacoes/extrato/${contaId}` : '/transacoes/extrato';
    api
      .get(url)
      .then(({ data }) => setTransacoes(data.transacoes || []))
      .catch(() => setErro('Erro ao carregar extrato'))
      .finally(() => setCarregando(false));
  }, [contaId]);

  if (carregando) return <div className="loader"><div className="spinner" />Carregando extrato...</div>;
  if (erro) return <div className="alert alert-error">{erro}</div>;

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Extrato</h3>
      {transacoes.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p>Nenhuma transação encontrada.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t) => {
                const cfg = tipoConfig[t.tipo_transacao] || { label: t.tipo_transacao, badge: 'badge-blue' };
                return (
                  <tr key={t.id}>
                    <td><span className={`badge ${cfg.badge}`}>{cfg.label}</span></td>
                    <td>{t.descricao || '-'}</td>
                    <td style={{ fontWeight: 600 }}>{formatarValor(t.valor)}</td>
                    <td>{formatarData(t.data_transacao)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
