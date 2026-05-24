import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import './ProfilePage.css';
export default function RegisterPage() {
  const { register } = useUser(); const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', password: '', password2: '' }); const [loading, setLoading] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => { e.preventDefault(); if (form.password !== form.password2) { toast.error('As passwords não coincidem.'); return; } setLoading(true);
    try { await register(form); toast.success('Conta criada!'); navigate('/'); } catch (err) { const errors = err.response?.data; if (errors) Object.values(errors).flat().forEach(m => toast.error(m)); else toast.error('Erro ao criar conta.'); } finally { setLoading(false); } };
  return (
    <div className="profile-page">
      <h1 className="page-title">Criar Conta</h1>
      <div className="profile-layout" style={{ gridTemplateColumns: '1fr', maxWidth: '600px', margin: '0 auto' }}>
        <div className="profile-card">
          <div className="profile-card-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '3rem' }}>🌱</span>
            <p style={{ color: '#D8F3DC', opacity: 0.8 }}>Junte-se à comunidade Legumes do Campo</p>
          </div>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group"><label>Primeiro nome</label><input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Maria" /></div>
              <div className="form-group"><label>Apelido</label><input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Silva" /></div>
            </div>
            <div className="form-group"><label>Username</label><input name="username" value={form.username} onChange={handleChange} required placeholder="Escolha um username" /></div>
            <div className="form-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="exemplo@email.pt" /></div>
            <div className="form-row">
              <div className="form-group"><label>Password</label><input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min. 6 caracteres" /></div>
              <div className="form-group"><label>Confirmar</label><input type="password" name="password2" value={form.password2} onChange={handleChange} required placeholder="Repetir password" /></div>
            </div>
            <div className="profile-form-actions" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>{loading ? 'A criar...' : 'Registar'}</button>
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#B7E4C7' }}>
                Já tem conta? <Link to="/login" style={{ color: '#52B788', fontWeight: 'bold', textDecoration: 'none' }}>Entrar</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
