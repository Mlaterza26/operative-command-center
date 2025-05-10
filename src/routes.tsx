
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import App from './App';
import NotFound from '@/pages/NotFound';
import PlaceholderPage from '@/pages/PlaceholderPage';
import Finance from '@/pages/Finance';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/sales" element={<PlaceholderPage />} />
      <Route path="/planning" element={<PlaceholderPage />} />
      <Route path="/client-success" element={<PlaceholderPage />} />
      <Route path="/ad-ops" element={<PlaceholderPage />} />
      <Route path="/finance" element={<Finance />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
