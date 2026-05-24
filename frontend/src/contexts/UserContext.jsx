import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/api';
const UserContext = createContext(null);
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getCurrentUser().then((res) => setUser(res.data)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const login = async (username, password) => { const res = await loginUser(username, password); setUser(res.data); return res.data; };
  const register = async (data) => { const res = await registerUser(data); setUser(res.data); return res.data; };
  const logout = async () => { await logoutUser(); setUser(null); };
  return (<UserContext.Provider value={{ user, setUser, login, register, logout, loading }}>{children}</UserContext.Provider>);
}
export function useUser() { const context = useContext(UserContext); if (!context) throw new Error('useUser deve ser usado dentro de um UserProvider'); return context; }
