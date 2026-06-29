import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege rotas que exigem autenticação.
 * Se não autenticado → redireciona para /login
 */
export default function PrivateRoute() {
  const { isAuthenticated, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="loader">
        <div className="spinner" />
        Carregando...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
