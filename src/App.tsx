import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerUploadPage } from './pages/customer/CustomerUploadPage';
import { CustomerRequestsPage } from './pages/customer/CustomerRequestsPage';
import { CustomerActiveSharesPage } from './pages/customer/CustomerActiveSharesPage';
import { CustomerPrivacyCenterPage } from './pages/customer/CustomerPrivacyCenterPage';
import { CustomerReceiptsPage } from './pages/customer/CustomerReceiptsPage';

// Shopkeeper Pages
import { ShopkeeperDashboard } from './pages/shopkeeper/ShopkeeperDashboard';
import { ShopkeeperScanPage } from './pages/shopkeeper/ShopkeeperScanPage';
import { ShopkeeperQueuePage } from './pages/shopkeeper/ShopkeeperQueuePage';
import { ShopkeeperProfilePage } from './pages/shopkeeper/ShopkeeperProfilePage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Auth */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Customer Experience Routes */}
            <Route path="/customer" element={<DashboardLayout />}>
              <Route index element={<CustomerDashboard />} />
              <Route path="upload" element={<CustomerUploadPage />} />
              <Route path="requests" element={<CustomerRequestsPage />} />
              <Route path="shares" element={<CustomerActiveSharesPage />} />
              <Route path="privacy" element={<CustomerPrivacyCenterPage />} />
              <Route path="receipts" element={<CustomerReceiptsPage />} />
            </Route>

            {/* Shopkeeper Experience Routes */}
            <Route path="/shopkeeper" element={<DashboardLayout />}>
              <Route index element={<ShopkeeperDashboard />} />
              <Route path="scan" element={<ShopkeeperScanPage />} />
              <Route path="queue" element={<ShopkeeperQueuePage />} />
              <Route path="profile" element={<ShopkeeperProfilePage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};
