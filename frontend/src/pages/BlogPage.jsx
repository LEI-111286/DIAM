import { useState, useEffect } from 'react';
import { getBlogPosts } from '../services/api';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './BlogPage.css';

export default function BlogPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { getBlogPosts().then(r => setPosts(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Blog</h1>
        <p>Receitas, dicas e benefícios nutricionais das leguminosas</p>
        {user?.is_staff && (
          <div style={{ marginTop: '20px' }}>
            <Link to="/adicionar-blog" className="add-product-btn" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', display: 'inline-block' }}>
              + Adicionar Novo Artigo
            </Link>
          </div>
        )}
      </div>
    <div className="blog-grid">{posts.map(p => (<article key={p.id} className="blog-card"><div className="blog-card-image">{p.image ? <img src={p.image.startsWith('http') ? p.image : 'http://localhost:8000'+p.image} alt={p.title}/> : <div className="blog-card-placeholder">📝</div>}</div>
      <div className="blog-card-content"><span className="blog-card-date">{new Date(p.created_at).toLocaleDateString('pt-PT',{day:'numeric',month:'long',year:'numeric'})}</span><h2 className="blog-card-title">{p.title}</h2><p className="blog-card-excerpt">{p.excerpt}</p><Link to={'/blog/'+p.slug} className="blog-card-link">Ler mais →</Link></div></article>))}</div>
    {posts.length === 0 && <div className="empty-state"><span className="empty-icon">📝</span><p>Sem artigos.</p></div>}</div>);
}
