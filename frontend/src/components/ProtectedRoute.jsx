import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();
  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
