import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout
import Layout from './components/common/Layout';

// Pages
import DashboardPage from './pages/DashboardPage';
import BiblePage from './pages/BiblePage';
import HymnsPage from './pages/HymnsPage';
import ServicesPage from './pages/ServicesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ChurchPage from './pages/ChurchPage';
import NoisePage from './pages/NoisePage';
import SettingsPage from './pages/SettingsPage';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import OTPVerification from './components/auth/OTPVerification';
import ChooseChurch from './components/auth/ChooseChurch';

// ============================================
// ROUTE PROTÉGÉE
// ============================================
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // ✅ Pendant le chargement, afficher un spinner
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner-content">
          <div className="spinner"></div>
          <p className="spinner-text">Chargement...</p>
        </div>
      </div>
    );
  }
  
  // ✅ Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // ✅ Si authentifié, afficher les enfants
  return <>{children}</>;
};

// ============================================
// ROUTE PUBLIQUE
// ============================================
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // ✅ Pendant le chargement, afficher un spinner
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner-content">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }
  
  // ✅ Si déjà authentifié, rediriger vers dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // ✅ Si non authentifié, afficher les enfants
  return <>{children}</>;
};

// ============================================
// APP ROUTES
// ============================================
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques - accessible sans connexion */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/verify-otp" element={<PublicRoute><OTPVerification /></PublicRoute>} />
      <Route path="/choose-church" element={<PublicRoute><ChooseChurch /></PublicRoute>} />
      
      {/* Routes protégées - nécessitent une connexion */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="bible" element={<BiblePage />} />
        <Route path="hymns" element={<HymnsPage />} />
        <Route path="services" element={<ServicesPage />} />
        
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="church" element={<ChurchPage />} />
        <Route path="noise" element={<NoisePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      {/* 404 - Page non trouvée */}
      <Route path="*" element={
        <div className="not-found">
          <h1>404</h1>
          <p>Page non trouvée</p>
          <a href="/dashboard">Retourner au tableau de bord</a>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;