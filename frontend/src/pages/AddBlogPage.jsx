import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { createBlogPost } from '../services/api';
import { toast } from 'react-toastify';
import './ProfilePage.css';

export default function AddBlogPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '', excerpt: '', content: ''
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!user || !user.is_staff) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('excerpt', formData.excerpt);
        data.append('content', formData.content);

        if (image) {
            data.append('image', image);
        }

        try {
            await createBlogPost(data);
            toast.success('Artigo publicado com sucesso!');
            navigate('/blog');
        } catch (err) {
            console.error(err);
            const dataError = err.response?.data;
            const errorMsg = dataError?.error || dataError?.detail || (typeof dataError === 'object' ? Object.values(dataError).flat().join(' | ') : 'Erro ao criar artigo.');
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <h1 className="page-title">Adicionar Novo Artigo</h1>
            <div className="profile-layout" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h2>Preencha os Dados do Artigo</h2>
                    </div>
                    {error && <p className="error-message" style={{ color: '#E57373', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(220,80,80,.12)', borderRadius: '8px' }}>{error}</p>}
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label>Título</label>
                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div className="form-group">
                            <label>Resumo (Excerpt)</label>
                            <textarea required value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} style={{ minHeight: '60px', width: '100%', padding: '0.8rem', background: 'rgba(20,30,25,.6)', border: '1px solid rgba(82,183,136,.2)', borderRadius: '8px', color: '#D8F3DC', fontFamily: 'inherit' }} placeholder="Pequena descrição que aparece na lista de artigos..." />
                        </div>

                        <div className="form-group">
                            <label>Conteúdo</label>
                            <textarea required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} style={{ minHeight: '200px', width: '100%', padding: '0.8rem', background: 'rgba(20,30,25,.6)', border: '1px solid rgba(82,183,136,.2)', borderRadius: '8px', color: '#D8F3DC', fontFamily: 'inherit' }} placeholder="Escreva aqui o conteúdo completo do artigo..." />
                        </div>

                        <div className="form-group">
                            <label>Imagem</label>
                            <input type="file" accept="image/png, image/jpeg" onChange={e => setImage(e.target.files[0])} style={{ width: '100%', padding: '0.8rem', background: 'rgba(20,30,25,.6)', border: '1px solid rgba(82,183,136,.2)', borderRadius: '8px', color: '#D8F3DC' }} />
                        </div>

                        <div className="profile-form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'A publicar...' : 'Publicar Artigo'}</button>
                            <button type="button" className="btn-secondary" onClick={() => navigate('/blog')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
