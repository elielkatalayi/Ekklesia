import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './context/AuthContext';
// App.jsx
import './styles/index.css';
import './styles/services.css';
import './styles/bible.css';
import './styles/hymns.css';
import './styles/dashboard.css';
import './styles/settings.css';
import './styles/announcements.css';
import './styles/church.css';
import './styles/noise.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;