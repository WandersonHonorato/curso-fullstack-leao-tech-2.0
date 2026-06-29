import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege rotas por papel (role).
 * Props:
 *   rolesPermitidos: array de strings, ex: ['funcionario'] ou ['cliente', 'funcionario']
 *   redirectTo: para onde redirecionar se não autorizado (default: '/acesso-negado')
 */
export default function RoleRoute({ rolesPermitidos = [], redirectTo }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="loader">
        <div className="spinner" />
        Verificando permissões...
      </div>
    );
  }

  if (!usuario || !rolesPermitidos.includes(usuario.tipo)) {
    const destino = redirectTo || (usuario?.tipo === 'cliente' ? '/cliente' : '/funcionario');
    return <Navigate to={destino} replace />;
  }

  return <Outlet />;
}
