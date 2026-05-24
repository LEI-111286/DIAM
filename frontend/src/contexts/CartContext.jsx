import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => { const saved = localStorage.getItem('cart'); return saved ? JSON.parse(saved) : []; });
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cartItems)); }, [cartItems]);
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => { const existing = prev.find((item) => item.id === product.id); if (existing) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item); return [...prev, { ...product, quantity }]; });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };
  const removeFromCart = (productId) => setCartItems((prev) => prev.filter((item) => item.id !== productId));
  const updateQuantity = (productId, quantity) => { if (quantity <= 0) { removeFromCart(productId); return; } setCartItems((prev) => prev.map((item) => item.id === productId ? { ...item, quantity } : item)); };
  const clearCart = () => { setCartItems([]); localStorage.removeItem('cart'); };
  const getTotal = () => cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  const getItemCount = () => cartItems.reduce((count, item) => count + item.quantity, 0);
  return (<CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount }}>{children}</CartContext.Provider>);
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider'); return context; }
