import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import authApi from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [otpData, setOtpData] = useState(null);

  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          console.log('✅ Utilisateur authentifié');
        } else {
          console.log('❌ Non authentifié');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Erreur:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Envoyer l'OTP
  const sendOtp = async (phoneNumber, channel = 'sms') => {
    setIsLoading(true);
    try {
      console.log('📱 Envoi OTP pour:', phoneNumber);
      const response = await authApi.sendOtp(phoneNumber, channel);
      
      if (response.data.success) {
        const data = response.data.data;
        console.log('✅ OTP envoyé:', data);
        
        setOtpData({
          otpId: data.otpId,
          phone: data.phone,
          userExists: data.userExists,
          needsProfileCompletion: data.needsProfileCompletion,
        });
        
        toast.success('Code envoyé avec succès');
        return { success: true, data };
      }
      
      throw new Error('Erreur lors de l\'envoi');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('❌ Erreur sendOtp:', message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier l'OTP
  const verifyOtp = async (code) => {
    if (!otpData?.otpId) {
      toast.error('Aucune session OTP');
      return { success: false, error: 'Aucune session OTP' };
    }

    setIsLoading(true);
    try {
      console.log('🔍 Vérification OTP pour:', otpData.otpId);
      const response = await authApi.verifyOtp(otpData.otpId, code);
      
      if (response.data.success) {
        const data = response.data.data;
        console.log('✅ OTP vérifié:', data);
        
        if (data.accessToken && data.user) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          setToken(data.accessToken);
          setUser(data.user);
          setIsAuthenticated(true);
          toast.success('Connexion réussie !');
          return { success: true, data, isComplete: true };
        }
        
        if (data.needsChurchSelection) {
          // ✅ Remplacer toast.info() par toast.success()
          toast.success('Veuillez choisir votre église');
          return { success: true, data, needsChurchSelection: true };
        }
        
        return { success: true, data };
      }
      
      throw new Error('Code invalide');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('❌ Erreur verifyOtp:', message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Choisir une église
  const chooseChurch = async (churchId, name) => {
    if (!otpData?.phone) {
      toast.error('Aucune session');
      return { success: false };
    }

    setIsLoading(true);
    try {
      const response = await authApi.chooseChurch(otpData.phone, churchId, name);
      
      if (response.data.success) {
        const data = response.data.data;
        if (data.accessToken && data.user) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          setToken(data.accessToken);
          setUser(data.user);
          setIsAuthenticated(true);
          toast.success('Bienvenue dans votre église !');
          return { success: true, data, isComplete: true };
        }
      }
      
      throw new Error('Erreur lors du choix');
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setOtpData(null);
      toast.success('Déconnecté');
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    otpData,
    sendOtp,
    verifyOtp,
    chooseChurch,
    logout,
    setOtpData,
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