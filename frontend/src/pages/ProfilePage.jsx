import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSearchParams } from 'react-router-dom';
import { getOrders, updateProfile } from '../services/api';
import { toast } from 'react-toastify';
import { FiEdit2, FiPackage, FiAlertCircle } from 'react-icons/fi';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', city: ''
  });

  // Campos obrigatórios para perfil completo
  const requiredProfileFields = ['phone', 'city'];
  const shouldHighlight = searchParams.get('complete') === '1';

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        city: user.profile?.city || '',
      });
    }
    getOrders().then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  // Auto-abrir edição se veio com ?complete=1
  useEffect(() => {
    if (shouldHighlight) {
      setEditing(true);
    }
  }, [shouldHighlight]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setEditing(false);
      setSearchParams({}); // Limpar o ?complete=1
      toast.success('Perfil atualizado!');
    } catch {
      toast.error('Erro ao atualizar.');
    }
  };

  // Verifica se um campo obrigatório está vazio (para destacar)
  const isFieldMissing = (fieldName) => {
    return shouldHighlight && requiredProfileFields.includes(fieldName) && !form[fieldName];
  };

  const statusLabels = {
    pendente: { label: 'Pendente', cls: 'status-pending' },
    processada: { label: 'Processada', cls: 'status-processing' },
    enviada: { label: 'Enviada', cls: 'status-shipped' },
    entregue: { label: 'Entregue', cls: 'status-delivered' },
    cancelada: { label: 'Cancelada', cls: 'status-cancelled' },
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">O Meu Perfil</h1>

      {/* Banner de perfil incompleto */}
      {shouldHighlight && (
        <div className="profile-incomplete-banner">
          <FiAlertCircle />
          <span>Complete os campos assinalados para poder finalizar encomendas.</span>
        </div>
      )}

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Dados Pessoais</h2>
            {!editing && (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                <FiEdit2 /> Editar
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Primeiro nome</label>
                  <input name="first_name" value={form.first_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Apelido</label>
                  <input name="last_name" value={form.last_name} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </div>
              <div className={`form-group ${isFieldMissing('phone') ? 'field-missing' : ''}`}>
                <label>
                  Telefone
                  {isFieldMissing('phone') && <span className="field-required-tag"><FiAlertCircle /> Preencher</span>}
                </label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="912 345 678" />
              </div>
              <div className={`form-group ${isFieldMissing('city') ? 'field-missing' : ''}`}>
                <label>
                  Cidade
                  {isFieldMissing('city') && <span className="field-required-tag"><FiAlertCircle /> Preencher</span>}
                </label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="Lisboa" />
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="btn-primary">Guardar</button>
                <button type="button" className="btn-secondary" onClick={() => { setEditing(false); setSearchParams({}); }}>Cancelar</button>
              </div>
            </form>
          ) : (
            <div className="profile-info-grid">
              <div className="info-item"><span className="info-label">Nome</span><span className="info-value">{user?.first_name} {user?.last_name}</span></div>
              <div className="info-item"><span className="info-label">Username</span><span className="info-value">{user?.username}</span></div>
              <div className="info-item"><span className="info-label">Email</span><span className="info-value">{user?.email}</span></div>
              <div className="info-item"><span className="info-label">Telefone</span><span className="info-value">{user?.profile?.phone || '—'}</span></div>
              <div className="info-item"><span className="info-label">Cidade</span><span className="info-value">{user?.profile?.city || '—'}</span></div>
            </div>
          )}
        </div>

        <div className="orders-card">
          <h2><FiPackage /> Histórico de Encomendas</h2>
          {loading ? (
            <div className="loading-container"><div className="loading-spinner"></div></div>
          ) : orders.length === 0 ? (
            <p className="no-orders">Ainda não realizou nenhuma encomenda.</p>
          ) : (
            <div className="orders-list">
              {orders.map(o => {
                const s = statusLabels[o.status] || { label: o.status, cls: '' };
                return (
                  <div key={o.id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">Encomenda #{o.id}</span>
                      <span className={`order-status ${s.cls}`}>{s.label}</span>
                    </div>
                    <div className="order-items">
                      {o.items?.map(i => (
                        <div key={i.id} className="order-item-row">
                          <span>{i.quantity}x {i.product_name}</span>
                          <span>{(i.price_at_purchase * i.quantity).toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <span className="order-date">{new Date(o.created_at).toLocaleDateString('pt-PT')}</span>
                      <span className="order-total">Total: {parseFloat(o.total).toFixed(2)}€</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
