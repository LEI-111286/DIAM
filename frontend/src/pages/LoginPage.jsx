import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import './AuthPages.css';
export default function LoginPage() {
  const { login } = useUser(); const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' }); const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { await login(form.username, form.password); toast.success('Bem-vindo!'); navigate('/'); } catch (err) { toast.error(err.response?.data?.error || 'Erro ao fazer login.'); } finally { setLoading(false); } };
  return (<div className="auth-page"><div className="auth-card"><div className="auth-header"><span className="auth-icon">🌿</span><h1>Entrar</h1><p>Aceda à sua conta Legumes do Campo</p></div>
    <form onSubmit={handleSubmit} className="auth-form"><div className="form-group"><label>Username</label><input name="username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required placeholder="O seu username" /></div>
    <div className="form-group"><label>Password</label><input type="password" name="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="A sua password" /></div>
    <button type="submit" className="auth-submit-btn" disabled={loading}>{loading ? 'A entrar...' : 'Entrar'}</button></form>
    <p className="auth-link">Não tem conta? <Link to="/register">Registar-se</Link></p></div></div>);
}
