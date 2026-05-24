import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ProductCard.css';
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`) : null;

  const handleAddToCart = () => {
    if (!user) {
      toast.info('Precisa de fazer login para adicionar ao carrinho.');
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-image-link">
        <div className="product-card-image">{imageUrl ? <img src={imageUrl} alt={product.name} /> : <div className="product-card-placeholder">🌱</div>}</div>
      </Link>
      <div className="product-card-content">
        <span className="product-card-category">{product.category_name}</span>
        <Link to={`/product/${product.slug}`}><h3 className="product-card-title">{product.name}</h3></Link>
        {product.average_rating > 0 && <div className="product-card-rating"><FiStar className="star-icon filled" /><span>{product.average_rating}</span></div>}
        <div className="product-card-footer">
          <span className="product-card-price">{parseFloat(product.price).toFixed(2)}€</span>
          <button className="product-card-add-btn" onClick={handleAddToCart} disabled={product.stock <= 0}><FiShoppingCart />{product.stock > 0 ? 'Adicionar' : 'Esgotado'}</button>
        </div>
      </div>
    </div>
  );
}
