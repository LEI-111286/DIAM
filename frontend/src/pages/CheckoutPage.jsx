import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { createOrder } from '../services/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css';
export default function CheckoutPage() {
  const { cartItems, getTotal, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ shipping_address: user?.profile?.address || '', shipping_city: user?.profile?.city || '', shipping_postal_code: user?.profile?.postal_code || '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await createOrder({ ...form, items: cartItems.map(i => ({ product_id: i.id, quantity: i.quantity })) }); clearCart(); toast.success('Encomenda realizada com sucesso!'); navigate('/profile'); }
    catch (err) { toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Erro ao processar.'); }
    finally { setSubmitting(false); }
  };
  if (cartItems.length === 0) { navigate('/cart'); return null; }
  // Bloquear checkout se perfil incompleto (telefone e cidade)
  const isProfileIncomplete = !user?.profile?.phone || !user?.profile?.city;
  if (isProfileIncomplete) { toast.info('Complete o seu perfil antes de encomendar.'); navigate('/profile?complete=1'); return null; }
  return (
    <div className="checkout-page"><h1 className="page-title">Finalizar Encomenda</h1><div className="checkout-layout">
      <form className="checkout-form" onSubmit={handleSubmit}><h2>Dados de Envio</h2>
        <div className="form-group"><label>Morada</label><input name="shipping_address" value={form.shipping_address} onChange={handleChange} required placeholder="Rua, numero..." /></div>
        <div className="form-row"><div className="form-group"><label>Cidade</label><input name="shipping_city" value={form.shipping_city} onChange={handleChange} required placeholder="Lisboa" /></div>
        <div className="form-group"><label>Codigo Postal</label><input name="shipping_postal_code" value={form.shipping_postal_code} onChange={handleChange} required placeholder="1200-100" /></div></div>
        <button type="submit" className="submit-order-btn" disabled={submitting}>{submitting ? 'A processar...' : 'Confirmar Encomenda'}</button>
      </form>
      <div className="checkout-summary"><h2>Resumo</h2>
        {cartItems.map(i => <div key={i.id} className="checkout-item"><span>{i.quantity}x {i.name}</span><span>{(parseFloat(i.price)*i.quantity).toFixed(2)}€</span></div>)}
        <div className="summary-divider"></div><div className="checkout-total"><span>Total</span><span>{getTotal().toFixed(2)}€</span></div>
      </div>
    </div></div>
  );
}
