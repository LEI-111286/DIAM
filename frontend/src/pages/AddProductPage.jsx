import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { createProduct, getCategories } from '../services/api';
import './ProfilePage.css';

export default function AddProductPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', category: ''
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data);
            } catch (err) {
                console.error('Erro ao carregar categorias', err);
            }
        };
        fetchCategories();
    }, []);

    if (!user || !user.is_staff) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category);

        if (image) {
            data.append('image', image);
        }

        try {
            // O 'await' garante que a submissão termina antes de mudarmos de página
            await createProduct(data);
            alert('Leguminosa adicionada com sucesso!');
            navigate('/');
        } catch (err) {
            console.error(err);
            const dataError = err.response?.data;
            const errorMsg = dataError?.error || dataError?.detail || (typeof dataError === 'object' ? Object.values(dataError).flat().join(' | ') : 'Erro ao criar produto.');
            setError(errorMsg);
        }
    };

    return (
        <div className="profile-page">
            <h1 className="page-title">Adicionar Nova Leguminosa</h1>
            <div className="profile-layout" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h2>Preencha os Dados</h2>
                    </div>
                    {error && <p className="error-message" style={{ color: '#E57373', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(220,80,80,.12)', borderRadius: '8px' }}>{error}</p>}
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        <div className="form-group">
                            <label>Descrição</label>
                            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ minHeight: '100px', width: '100%', padding: '0.8rem', background: 'rgba(20,30,25,.6)', border: '1px solid rgba(82,183,136,.2)', borderRadius: '8px', color: '#D8F3DC', fontFamily: 'inherit' }} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Preço (€)</label>
                                <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Categoria</label>
                            <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.8rem', background: 'rgba(20,30,25,.6)', border: '1px solid rgba(82,183,136,.2)', borderRadius: '8px', color: '#D8F3DC' }}>
                                <option value="">Selecione uma categoria</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Imagem</label>
                            <input type="file" accept="image/png, image/jpeg" onChange={e => setImage(e.target.files[0])} style={{ width: '100%', padding: '0.8rem', background: 'rgba(20,30,25,.6)', border: '1px solid rgba(82,183,136,.2)', borderRadius: '8px', color: '#D8F3DC' }} />
                        </div>

                        <div className="profile-form-actions">
                            <button type="submit" className="btn-primary">Guardar Leguminosa</button>
                            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}