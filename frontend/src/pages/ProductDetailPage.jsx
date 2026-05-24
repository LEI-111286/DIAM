import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, submitReview } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { FiStar, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProduct = () => { getProduct(slug).then((res) => setProduct(res.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(() => { fetchProduct(); }, [slug]);

  const handleAddToCart = () => {
    if (!user) { toast.info('Precisa de fazer login para adicionar ao carrinho.'); navigate('/login'); return; }
    addToCart(product, quantity); setQuantity(1);
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Tem de estar autenticado para avaliar.'); return; }
    setSubmitting(true);
    try { await submitReview({ product: product.id, rating: reviewRating, comment: reviewComment }); toast.success('Avaliação submetida!'); setReviewComment(''); setReviewRating(5); fetchProduct(); }
    catch (err) { toast.error(err.response?.data?.error || 'Erro ao submeter.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (!product) return <div className="page-container"><div className="empty-state"><span className="empty-icon">😕</span><p>Produto não encontrado.</p></div></div>;

  const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`) : null;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-image">{imageUrl ? <img src={imageUrl} alt={product.name} /> : <div className="product-detail-placeholder">🌱</div>}</div>
        <div className="product-detail-info">
          <span className="product-detail-category">{product.category?.name}</span>
          <h1 className="product-detail-title">{product.name}</h1>
          {product.average_rating > 0 && <div className="product-detail-rating">{[1,2,3,4,5].map(s => <FiStar key={s} className={`star ${s <= Math.round(product.average_rating) ? 'filled' : ''}`} />)}<span className="rating-value">{product.average_rating}</span><span className="rating-count">({product.reviews?.length || 0} avaliações)</span></div>}
          <p className="product-detail-description">{product.description}</p>
          {product.origin && <div className="product-detail-meta"><span className="meta-label">Origem:</span><span className="meta-value">{product.origin}</span></div>}
          {product.nutritional_info && <div className="product-detail-nutrition"><h3>Informação Nutricional</h3><p>{product.nutritional_info}</p></div>}
          <div className="product-detail-price-section">
            <span className="product-detail-price">{parseFloat(product.price).toFixed(2)}€</span>
            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>{product.stock > 0 ? `${product.stock} em stock` : 'Esgotado'}</span>
          </div>
          {product.stock > 0 && <div className="product-detail-actions">
            <div className="quantity-selector"><button onClick={() => setQuantity(Math.max(1, quantity-1))} className="qty-btn"><FiMinus /></button><span className="qty-value">{quantity}</span><button onClick={() => setQuantity(Math.min(product.stock, quantity+1))} className="qty-btn"><FiPlus /></button></div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}><FiShoppingCart /> Adicionar ao Carrinho</button>
          </div>}
        </div>
      </div>
      <div className="reviews-section">
        <h2 className="section-title">Avaliações</h2>
        {user && <form className="review-form" onSubmit={handleSubmitReview}><h3>Deixe a sua avaliação</h3>
          <div className="review-rating-input">{[1,2,3,4,5].map(s => <button key={s} type="button" className={`star-btn ${s <= reviewRating ? 'active' : ''}`} onClick={() => setReviewRating(s)}><FiStar /></button>)}</div>
          <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Escreva o seu comentário..." rows="3" required className="review-textarea" />
          <button type="submit" className="review-submit-btn" disabled={submitting}>{submitting ? 'A enviar...' : 'Submeter Avaliação'}</button>
        </form>}
        <div className="reviews-list">
          {product.reviews?.length > 0 ? product.reviews.map((r) => (
            <div key={r.id} className="review-card"><div className="review-header"><span className="review-username">{r.username}</span><div className="review-stars">{[1,2,3,4,5].map(s => <FiStar key={s} className={`star-small ${s <= r.rating ? 'filled' : ''}`} />)}</div></div><p className="review-comment">{r.comment}</p><span className="review-date">{new Date(r.created_at).toLocaleDateString('pt-PT')}</span></div>
          )) : <p className="no-reviews">Ainda não existem avaliações.</p>}
        </div>
      </div>
    </div>
  );
}
