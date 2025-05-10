
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import App from './App';
import NotFound from '@/pages/NotFound';
import PlaceholderPage from '@/pages/PlaceholderPage';
import Finance from '@/pages/Finance';
import Settings from '@/pages/Settings';
import { ThemeProvider } from '@/hooks/use-theme';
import { ViewContextProvider } from '@/hooks/use-view-context';
import { ZapierConfigProvider } from '@/hooks/use-zapier-config';
import { AIChatProvider } from '@/hooks/use-ai-chat';
import ChatBot from '@/components/ChatBot/ChatBot';
import { Toaster } from 'sonner';

const AppRoutes: React.FC = () => {
  return (
    <ThemeProvider>
      <ViewContextProvider>
        <ZapierConfigProvider>
          <AIChatProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/sales" element={<PlaceholderPage />} />
              <Route path="/planning" element={<PlaceholderPage />} />
              <Route path="/client-success" element={<PlaceholderPage />} />
              <Route path="/ad-ops" element={<PlaceholderPage />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reports" element={<PlaceholderPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatBot />
            <Toaster />
          </AIChatProvider>
        </ZapierConfigProvider>
      </ViewContextProvider>
    </ThemeProvider>
  );
};

export default AppRoutes;
