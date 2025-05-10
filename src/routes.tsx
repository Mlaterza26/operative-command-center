
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import App from './App';
import NotFound from '@/pages/NotFound';
import PlaceholderPage from '@/pages/PlaceholderPage';
import Finance from '@/pages/Finance';
import Settings from '@/pages/Settings';
import { ThemeProvider } from '@/hooks/use-theme';
import CommandLayout from '@/components/ui/CommandLayout';

const AppRoutes: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<CommandLayout><App /></CommandLayout>} />
        <Route path="/sales" element={<CommandLayout><PlaceholderPage /></CommandLayout>} />
        <Route path="/planning" element={<CommandLayout><PlaceholderPage /></CommandLayout>} />
        <Route path="/client-success" element={<CommandLayout><PlaceholderPage /></CommandLayout>} />
        <Route path="/ad-ops" element={<CommandLayout><PlaceholderPage /></CommandLayout>} />
        <Route path="/finance" element={<CommandLayout><Finance /></CommandLayout>} />
        <Route path="/settings" element={<CommandLayout><Settings /></CommandLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default AppRoutes;
