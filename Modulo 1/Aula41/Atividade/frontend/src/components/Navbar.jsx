import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ links = [] }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">🏦 FinanceiroApp</span>

      <div className="navbar-nav">
        {links.map((link) => (
          <button
            key={link.path}
            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </button>
        ))}

        <span className="navbar-user">
          {usuario?.nome} ({usuario?.tipo})
        </span>

        <button className="navbar-link" onClick={handleLogout} style={{ color: '#fca5a5' }}>
          Sair
        </button>
      </div>
    </nav>
  );
}
