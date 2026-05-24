import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (searchTerm) params.search = searchTerm;
    getProducts(params).then((res) => setProducts(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [activeCategory, searchTerm]);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Leguminosas frescas,<br /><span className="hero-highlight">direto do campo</span></h1>
          <p className="hero-subtitle">Descubra a nossa seleção de leguminosas de origem local e sustentável. Do produtor ao seu prato, com qualidade e sabor autêntico.</p>
          <div className="hero-search"><input type="text" placeholder="Pesquisar leguminosas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" /></div>
        </div>
        <div className="hero-decoration"><span className="hero-emoji">🌿</span></div>
      </section>
      <section className="categories-section">
        <div className="categories-list">
          <button className={`category-btn ${!activeCategory ? 'active' : ''}`} onClick={() => setActiveCategory('')}>Todos</button>
          {categories.map((cat) => (<button key={cat.id} className={`category-btn ${activeCategory === cat.slug ? 'active' : ''}`} onClick={() => setActiveCategory(cat.slug)}>{cat.name}</button>))}
        </div>
      </section>
      <section className="products-section">
        {loading ? <div className="loading-container"><div className="loading-spinner"></div></div> :
         products.length === 0 ? <div className="empty-state"><span className="empty-icon">🔍</span><p>Nenhum produto encontrado.</p></div> :
         <div className="products-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
      </section>
    </div>
  );
}
