// AppRoutes.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout
import Layout from './components/common/Layout';

// Pages
import DashboardPage from './pages/DashboardPage';
import ChurchPage from './pages/ChurchPage';
import NoisePage from './pages/NoisePage';
import SettingsPage from './pages/SettingsPage';

// ✅ Pages de la Bible
import { BiblePage, BibleBookPage, BibleChapterPage } from './pages/bible';

// ✅ Pages des Cantiques
import { HymnsPage, HymnBookPage, HymnDetailPage } from './pages/hymns';

// ✅ Pages des Services
import { 
  ServiceListPage, 
  ServiceDetailPage, 
  ServiceBuilderPage,
  ServiceOrderPage,
  ServiceOrderAddPage,
  ServiceOrderEditPage
} from './pages/services';

// ✅ Pages des Annonces
import { 
  AnnouncementListPage, 
  AnnouncementDetailPage, 
  AnnouncementBuilderPage 
} from './pages/announcements';

// ✅ Guards
import { 
  ServiceManagerGuard,
  OrderManagerGuard,
  AnnouncementManagerGuard
} from './components/guards';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ChooseChurchPage from './components/auth/ChooseChurchPage';
import RegisterConfirmPage from './components/auth/RegisterConfirmPage';

// ============================================
// ROUTE PROTÉGÉE
// ============================================
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
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
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// ============================================
// ROUTE PUBLIQUE
// ============================================
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner-content">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// ============================================
// APP ROUTES
// ============================================
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/choose-church" element={<PublicRoute><ChooseChurchPage /></PublicRoute>} />
      <Route path="/register-confirm" element={<PublicRoute><RegisterConfirmPage /></PublicRoute>} />
      
      {/* Routes protégées */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Routes de la Bible */}
        <Route path="bible" element={<BiblePage />} />
        <Route path="bible/:bookId" element={<BibleBookPage />} />
        <Route path="bible/:bookId/:chapter" element={<BibleChapterPage />} />
        
        {/* Routes des Cantiques */}
        <Route path="hymns" element={<HymnsPage />} />
        <Route path="hymns/:bookId" element={<HymnBookPage />} />
        <Route path="hymns/:bookId/:hymnId" element={<HymnDetailPage />} />
        
        {/* ✅ Routes des Services */}
        <Route path="services">
          <Route index element={<ServiceListPage />} />
          
          <Route 
            path="new" 
            element={
              <ServiceManagerGuard>
                <ServiceBuilderPage />
              </ServiceManagerGuard>
            } 
          />
          
          <Route path=":id">
            <Route index element={<ServiceDetailPage />} />
            
            <Route 
              path="edit" 
              element={
                <ServiceManagerGuard>
                  <ServiceBuilderPage />
                </ServiceManagerGuard>
              } 
            />
            
            {/* ✅ Routes de l'ordre */}
            <Route path="order">
              <Route index element={<ServiceOrderPage />} />
              
              <Route 
                path="new" 
                element={
                  <OrderManagerGuard>
                    <ServiceOrderAddPage />
                  </OrderManagerGuard>
                } 
              />
              
              <Route 
                path=":orderId/edit" 
                element={
                  <OrderManagerGuard>
                    <ServiceOrderEditPage />
                  </OrderManagerGuard>
                } 
              />
            </Route>
            
            <Route 
              path="publish" 
              element={
                <ServiceManagerGuard>
                  <ServiceDetailPage />
                </ServiceManagerGuard>
              } 
            />
            
            <Route 
              path="delete" 
              element={
                <ServiceManagerGuard>
                  <ServiceDetailPage />
                </ServiceManagerGuard>
              } 
            />
          </Route>
        </Route>
        
        {/* ✅ Routes des Annonces */}
        <Route path="announcements">
          <Route index element={<AnnouncementListPage />} />
          
          <Route 
            path="new" 
            element={
              <AnnouncementManagerGuard>
                <AnnouncementBuilderPage />
              </AnnouncementManagerGuard>
            } 
          />
          
          <Route path=":id">
            <Route index element={<AnnouncementDetailPage />} />
            
            <Route 
              path="edit" 
              element={
                <AnnouncementManagerGuard>
                  <AnnouncementBuilderPage />
                </AnnouncementManagerGuard>
              } 
            />
          </Route>
        </Route>
        
        <Route path="church" element={<ChurchPage />} />
        <Route path="noise" element={<NoisePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      {/* 404 */}
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