
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import App from './App';
import NotFound from '@/pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/sales" element={<App />} />
      <Route path="/planning" element={<App />} />
      <Route path="/client-success" element={<App />} />
      <Route path="/ad-ops" element={<App />} />
      <Route path="/finance" element={<App />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
