import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8000/api/', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});
function getCookie(name) { const value = `; ${document.cookie}`; const parts = value.split(`; ${name}=`); if (parts.length === 2) return parts.pop().split(';').shift(); return null; }
export const loginUser = (username, password) => api.post('auth/login/', { username, password });
export const registerUser = (data) => api.post('auth/register/', data);
export const logoutUser = () => api.post('auth/logout/');
export const getCurrentUser = () => api.get('auth/user/');
export const updateProfile = (data) => api.put('auth/profile/', data);
export const getCategories = () => api.get('categories/');
export const getProducts = (params = {}) => api.get('products/', { params });
export const getProduct = (slug) => api.get(`products/${slug}/`);
export const createOrder = (data) => api.post('orders/create/', data);
export const getOrders = () => api.get('orders/');
export const submitReview = (data) => api.post('reviews/', data);
export const getBlogPosts = () => api.get('blog/');
export const getBlogPost = (slug) => api.get(`blog/${slug}/`);
export default api;
