
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface Metrics {
  [key: string]: string | number;
}

interface ViewContextType {
  currentView: string | null;
  currentMetrics: Metrics | null;
  updateCurrentView: (view: string) => void;
  updateMetrics: (metrics: Metrics) => void;
  clearContext: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<Metrics | null>(null);
  const location = useLocation();

  // Update current view based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") {
      setCurrentView("Dashboard");
    } else if (path === "/finance") {
      setCurrentView("Finance Dashboard");
    } else if (path === "/settings") {
      setCurrentView("Settings");
    } else if (path.includes("/sales")) {
      setCurrentView("Sales Dashboard");
    } else if (path.includes("/planning")) {
      setCurrentView("Planning Dashboard");
    } else if (path.includes("/client-success")) {
      setCurrentView("Client Success Dashboard");
    } else if (path.includes("/ad-ops")) {
      setCurrentView("Ad Operations Dashboard");
    } else {
      setCurrentView(path.replace("/", "").charAt(0).toUpperCase() + path.slice(2));
    }
  }, [location]);

  // Programmatically update the current view
  const updateCurrentView = useCallback((view: string) => {
    setCurrentView(view);
  }, []);

  // Update metrics displayed on the current view
  const updateMetrics = useCallback((metrics: Metrics) => {
    setCurrentMetrics(prev => ({
      ...prev,
      ...metrics
    }));
  }, []);

  // Clear context
  const clearContext = useCallback(() => {
    setCurrentMetrics(null);
  }, []);

  const value = {
    currentView,
    currentMetrics,
    updateCurrentView,
    updateMetrics,
    clearContext
  };

  return (
    <ViewContext.Provider value={value}>
      {children}
    </ViewContext.Provider>
  );
};

export const useViewContext = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useViewContext must be used within a ViewContextProvider");
  }
  return context;
};
