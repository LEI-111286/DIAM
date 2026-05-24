import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const { user } = useUser();

  // Perfil incompleto — falta morada, código postal, cidade ou telefone
  const isProfileIncomplete = user && (
    !user.profile?.phone || !user.profile?.city
  );

  if (cartItems.length === 0) return (
    <div className="page-container"><div className="empty-state"><span className="empty-icon">🛒</span><h2>O seu carrinho está vazio</h2><p>Adicione leguminosas do nosso catálogo!</p><Link to="/" className="btn-primary">Ver Catálogo</Link></div></div>
  );

  return (
    <div className="cart-page"><h1 className="page-title">Carrinho de Compras</h1><div className="cart-layout"><div className="cart-items">
      {cartItems.map((item) => (<div key={item.id} className="cart-item">
        <div className="cart-item-image">{item.image ? <img src={item.image.startsWith('http') ? item.image : 'http://localhost:8000'+item.image} alt={item.name} /> : <div className="cart-item-placeholder">🌱</div>}</div>
        <div className="cart-item-info"><Link to={'/product/'+item.slug} className="cart-item-name">{item.name}</Link><span className="cart-item-price">{parseFloat(item.price).toFixed(2)}€ /un.</span></div>
        <div className="cart-item-quantity"><button onClick={() => updateQuantity(item.id, item.quantity-1)} className="qty-btn"><FiMinus /></button><span className="qty-value">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity+1)} className="qty-btn"><FiPlus /></button></div>
        <span className="cart-item-subtotal">{(parseFloat(item.price)*item.quantity).toFixed(2)}€</span>
        <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}><FiTrash2 /></button>
      </div>))}
    </div><div className="cart-summary"><h2>Resumo</h2>
      <div className="summary-row"><span>Subtotal</span><span>{getTotal().toFixed(2)}€</span></div>
      <div className="summary-row"><span>Envio</span><span className="free-shipping">Grátis</span></div>
      <div className="summary-divider"></div>
      <div className="summary-row total"><span>Total</span><span>{getTotal().toFixed(2)}€</span></div>

      {isProfileIncomplete ? (
        <>
          <Link to="/profile?complete=1" className="checkout-btn checkout-btn-blocked">
            <FiAlertCircle /> Complete o perfil para encomendar
          </Link>
          <p className="checkout-blocked-hint">Preencha o telefone e a cidade no seu perfil.</p>
        </>
      ) : (
        <Link to="/checkout" className="checkout-btn"><FiShoppingBag /> Finalizar Encomenda</Link>
      )}

      <button className="clear-cart-btn" onClick={clearCart}>Limpar Carrinho</button>
    </div></div></div>
  );
}
