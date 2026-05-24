import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiAlertCircle } from 'react-icons/fi';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useUser();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = getItemCount();
  const handleLogout = async () => { await logout(); navigate('/'); setMenuOpen(false); };

  // Verificar se o perfil está incompleto
  const isProfileIncomplete = user && (
    !user.profile?.phone || !user.profile?.city
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🌿</span>
          <span className="logo-text">Legumes do Campo</span>
        </Link>
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Catálogo</Link>

          {isProfileIncomplete && (
            <Link
              to="/profile?complete=1"
              className="profile-warning-badge"
              onClick={() => setMenuOpen(false)}
              title="Complete o seu perfil"
            >
              <FiAlertCircle />
              <span className="warning-text">Complete o registo</span>
            </Link>
          )}

          <Link to="/blog" className="nav-link" onClick={() => setMenuOpen(false)}>Blog</Link>
          <div className="navbar-actions">
            <Link to="/cart" className="nav-link cart-link" onClick={() => setMenuOpen(false)}>
              <FiShoppingCart />{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="nav-link user-link" onClick={() => setMenuOpen(false)}>
                  <FiUser /><span>{user.first_name || user.username}</span>
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn"><FiLogOut /></button>
              </>
            ) : (
              <Link to="/login" className="nav-link login-link" onClick={() => setMenuOpen(false)}>
                <FiUser /><span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
