import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { createProduct } from '../services/api';
import './AuthPages.css'; // Reutiliza os estilos dos formulários

export default function AddProductPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', category: ''
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

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
            setError('Erro ao criar produto.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Adicionar Nova Leguminosa</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Nome</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
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
                        <label>Imagem</label>
                        <input type="file" accept="image/png, image/jpeg" onChange={e => setImage(e.target.files[0])} />
                    </div>

                    <button type="submit" className="auth-button">Guardar Leguminosa</button>
                </form>
            </div>
        </div>
    );
}