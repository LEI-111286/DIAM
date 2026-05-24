import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import './ProfilePage.css';
export default function LoginPage() {
  const { login } = useUser(); const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' }); const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { await login(form.username, form.password); toast.success('Bem-vindo!'); navigate('/'); } catch (err) { toast.error(err.response?.data?.error || 'Erro ao fazer login.'); } finally { setLoading(false); } };
  return (
    <div className="profile-page">
      <h1 className="page-title">Entrar</h1>
      <div className="profile-layout" style={{ gridTemplateColumns: '1fr', maxWidth: '500px', margin: '0 auto' }}>
        <div className="profile-card">
          <div className="profile-card-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '3rem' }}>🌿</span>
            <p style={{ color: '#D8F3DC', opacity: 0.8 }}>Aceda à sua conta Legumes do Campo</p>
          </div>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input name="username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required placeholder="O seu username" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="A sua password" />
            </div>
            <div className="profile-form-actions" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>{loading ? 'A entrar...' : 'Entrar'}</button>
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#B7E4C7' }}>
                Não tem conta? <Link to="/register" style={{ color: '#52B788', fontWeight: 'bold', textDecoration: 'none' }}>Registar-se</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
