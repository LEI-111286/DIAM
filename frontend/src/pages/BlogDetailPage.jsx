import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost } from '../services/api';
import './BlogDetailPage.css';
export default function BlogDetailPage() {
  const { slug } = useParams(); const [post, setPost] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { getBlogPost(slug).then(r => setPost(r.data)).catch(console.error).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (!post) return <div className="page-container"><div className="empty-state"><p>Artigo não encontrado.</p></div></div>;
  return (<div className="blog-detail-page"><Link to="/blog" className="back-link">← Voltar ao Blog</Link>
    <article className="blog-article"><header className="blog-article-header"><span className="blog-article-date">{new Date(post.created_at).toLocaleDateString('pt-PT',{day:'numeric',month:'long',year:'numeric'})}</span><h1>{post.title}</h1><span className="blog-article-author">Por {post.author_name}</span></header>
    {post.image && <div className="blog-article-image"><img src={post.image.startsWith('http') ? post.image : 'http://localhost:8000'+post.image} alt={post.title}/></div>}
    <div className="blog-article-content">{post.content.split('\n').map((p,i) => { if (p.startsWith('**') && p.endsWith('**')) return <h3 key={i}>{p.replace(/\*\*/g,'')}</h3>; if (p.startsWith('- ')) return <li key={i}>{p.substring(2)}</li>; if (!p.trim()) return <br key={i}/>; return <p key={i}>{p}</p>; })}</div></article></div>);
}
