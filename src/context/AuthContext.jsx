import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import authApi from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [churches, setChurches] = useState([]);
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [viewingChurch, setViewingChurch] = useState(null);

  // Charger les données au démarrage
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          await loadChurches();
          
          try {
            const meResponse = await authApi.getMe();
            if (meResponse.data.success) {
              const { user, viewingChurch } = meResponse.data.data;
              setUser(user);
              setViewingChurch(viewingChurch);
            }
          } catch (error) {
            console.log('⚠️ Erreur chargement profil:', error.message);
          }
        } else {
          await loadChurches();
        }
      } catch (error) {
        console.error('❌ Erreur auth:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const loadChurches = async () => {
    try {
      const response = await authApi.getChurches();
      if (response.data.success) {
        setChurches(response.data.data.churches || []);
      }
    } catch (error) {
      console.error('❌ Erreur chargement églises:', error);
    }
  };

  const register = async (phone, name, churchId) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({ phone, name, churchId });
      if (response.data.success) {
        const data = response.data.data;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.accessToken);
        setUser(data.user);
        setViewingChurch(data.church);
        setIsAuthenticated(true);
        toast.success('Inscription réussie !');
        return { success: true, data };
      }
      throw new Error('Erreur lors de l\'inscription');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone, churchCode = null) => {
    setIsLoading(true);
    try {
      const payload = { phone };
      if (churchCode) payload.churchCode = churchCode;
      const response = await authApi.login(payload);
      if (response.data.success) {
        const data = response.data.data;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.accessToken);
        setUser(data.user);
        setViewingChurch(data.viewingChurch);
        setIsAuthenticated(true);
        toast.success('Connexion réussie !');
        return { success: true, data };
      }
      throw new Error('Erreur lors de la connexion');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const switchChurch = async (churchCode) => {
    setIsLoading(true);
    try {
      const response = await authApi.switchChurch({ churchCode });
      if (response.data.success) {
        const data = response.data.data;
        localStorage.setItem('accessToken', data.accessToken);
        setToken(data.accessToken);
        setViewingChurch(data.church);
        toast.success(`Église changée : ${data.church.name}`);
        return { success: true, data };
      }
      throw new Error('Erreur lors du changement d\'église');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Version corrigée du logout
  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await authApi.logout();
        } catch (error) {
          console.log('⚠️ Erreur lors de la déconnexion serveur:', error.message);
        }
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setViewingChurch(null);
      toast.success('Déconnecté');
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    churches,
    selectedChurch,
    setSelectedChurch,
    viewingChurch,
    register,
    login,
    switchChurch,
    logout,
    loadChurches,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
};

export default AuthContext;