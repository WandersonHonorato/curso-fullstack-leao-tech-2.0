import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';
import Login from './pages/Login';
import ClienteDashboard from './pages/ClienteDashboard';
import FuncionarioDashboard from './pages/FuncionarioDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route element={<RoleRoute rolesPermitidos={['cliente']} />}>
              <Route path="/cliente" element={<ClienteDashboard />} />
            </Route>

            <Route element={<RoleRoute rolesPermitidos={['funcionario']} />}>
              <Route path="/funcionario" element={<FuncionarioDashboard />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
