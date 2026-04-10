import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, LayoutDashboard, Compass } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Compass size={28} />
          <span>Periferia</span>
        </Link>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">
                <LayoutDashboard size={20} style={{display: 'inline', marginRight: '4px', verticalAlign: 'middle'}}/>
                Feed
              </Link>
              <Link to="/profile" className="nav-link">
                <User size={20} style={{display: 'inline', marginRight: '4px', verticalAlign: 'middle'}}/>
                Mi Perfil
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" style={{padding: '0.5rem 1rem'}}>
                <LogOut size={16} /> Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/register" className="btn btn-primary">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
