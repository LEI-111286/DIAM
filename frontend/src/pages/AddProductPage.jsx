import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { createProduct } from '../services/api';
import './AuthPages.css'; // Podes reaproveitar o CSS do Login/Register para o formulário

export default function AddProductPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    // Estados para os campos do formulário
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    // Se não for staff, nem deve ver a página (redireciona para a home)
    if (!user || !user.is_staff) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Criação do objeto FormData obrigatório para envio de ficheiros
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category', category);

        // Anexa a imagem apenas se o utilizador tiver selecionado uma
        if (image) {
            formData.append('image', image);
        }

        try {
            await createProduct(formData);
            alert('Leguminosa adicionada com sucesso!');
            navigate('/'); // Volta para o catálogo
        } catch (err) {
            console.error(err);
            setError('Erro ao criar produto. Verifica os dados.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Adicionar Nova Leguminosa</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text" placeholder="Nome (ex: Feijão Frade)" required
                    value={name} onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    placeholder="Descrição" required rows="3"
                    value={description} onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="number" placeholder="Preço (€)" required step="0.01" min="0"
                    value={price} onChange={(e) => setPrice(e.target.value)}
                />

                <input
                    type="number" placeholder="Stock disponível" required min="0"
                    value={stock} onChange={(e) => setStock(e.target.value)}
                />

                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>Selecione uma Categoria</option>
                    <option value="Feijão">Feijão</option>
                    <option value="Grão">Grão</option>
                    <option value="Lentilhas">Lentilhas</option>
                    <option value="Ervilhas">Ervilhas</option>
                </select>

                {/* Input para carregar a imagem PNG/JPEG */}
                <div className="file-input-group">
                    <label>Imagem da leguminosa:</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="auth-button">Adicionar ao Catálogo</button>
            </form>
        </div>
    );
}