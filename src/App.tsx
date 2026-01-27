import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth';
import { IntegrationProvider } from './context/IntegrationContext';
import Login from './pages/Login';
import NikeDashboard from './pages/nike/NikeDashboard';
import CentauroDashboard from './pages/centauro/CentauroDashboard';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <IntegrationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Nike Routes */}
          <Route
            path="/nike/dashboard"
            element={
              <PrivateRoute>
                <NikeDashboard />
              </PrivateRoute>
            }
          />
          
          {/* Centauro Routes */}
          <Route
            path="/centauro/dashboard"
            element={
              <PrivateRoute>
                <CentauroDashboard />
              </PrivateRoute>
            }
          />
          
          {/* Default redirect to Nike dashboard */}
          <Route path="/" element={<Navigate to="/nike/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/nike/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </IntegrationProvider>
  );
};

export default App;

