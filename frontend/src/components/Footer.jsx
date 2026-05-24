import { Link } from 'react-router-dom';
import './Footer.css';
export default function Footer() {
  return (
    <footer className="footer"><div className="footer-container">
      <div className="footer-section"><h3 className="footer-title"><span>🌿</span> Legumes do Campo</h3><p className="footer-desc">Plataforma de e-commerce dedicada à venda de leguminosas de origem local e sustentável.</p></div>
      <div className="footer-section"><h4 className="footer-subtitle">Navegação</h4><ul className="footer-links"><li><Link to="/">Catálogo</Link></li><li><Link to="/blog">Blog</Link></li><li><Link to="/cart">Carrinho</Link></li></ul></div>
      <div className="footer-section"><h4 className="footer-subtitle">Conta</h4><ul className="footer-links"><li><Link to="/login">Entrar</Link></li><li><Link to="/register">Registar</Link></li><li><Link to="/profile">Perfil</Link></li></ul></div>
      <div className="footer-section"><h4 className="footer-subtitle">Contacto</h4><ul className="footer-links"><li>info@legumesdocampo.pt</li><li>+351 912 345 678</li><li>Lisboa, Portugal</li></ul></div>
    </div><div className="footer-bottom"><p>&copy; 2026 Legumes do Campo. Projeto DIAM.</p></div></footer>
  );
}
