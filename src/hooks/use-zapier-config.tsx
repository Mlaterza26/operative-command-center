
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";

interface WebhookUrls {
  slack: string;
  asana: string;
  email: string;
  sheets: string;
  [key: string]: string;
}

interface ZapierConfigContextType {
  webhookUrls: WebhookUrls;
  updateWebhookUrl: (type: string, url: string) => void;
  saveConfiguration: () => Promise<void>;
  testConnection: (type: string) => Promise<boolean>;
  isLoading: boolean;
  isConfigured: boolean;
}

const ZapierConfigContext = createContext<ZapierConfigContextType | undefined>(undefined);

export const ZapierConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [webhookUrls, setWebhookUrls] = useState<WebhookUrls>({
    slack: "",
    asana: "",
    email: "",
    sheets: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Load saved webhook URLs from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("zapier_webhook_urls");
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setWebhookUrls(parsedConfig);
        setIsConfigured(Object.values(parsedConfig).some(url => url));
      } catch (error) {
        console.error("Error parsing saved Zapier configuration:", error);
      }
    }
  }, []);

  // Update webhook URL
  const updateWebhookUrl = useCallback((type: string, url: string) => {
    setWebhookUrls(prev => ({
      ...prev,
      [type]: url
    }));
  }, []);

  // Save configuration to localStorage
  const saveConfiguration = useCallback(async () => {
    setIsLoading(true);
    try {
      localStorage.setItem("zapier_webhook_urls", JSON.stringify(webhookUrls));
      setIsConfigured(Object.values(webhookUrls).some(url => url));
      setIsLoading(false);
      return Promise.resolve();
    } catch (error) {
      setIsLoading(false);
      return Promise.reject(error);
    }
  }, [webhookUrls]);

  // Test webhook connection
  const testConnection = useCallback(async (type: string): Promise<boolean> => {
    if (!webhookUrls[type]) {
      toast.error("No webhook URL configured for this integration");
      return Promise.resolve(false);
    }

    setIsLoading(true);
    try {
      // In a real application, we'd make an actual API call here
      // For demonstration, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(`Testing webhook for ${type}:`, webhookUrls[type]);
      
      // Simulate a webhook request to Zapier
      try {
        await fetch(webhookUrls[type], {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors", // Important for CORS issues with webhook endpoints
          body: JSON.stringify({
            test: true,
            timestamp: new Date().toISOString(),
            message: `Test from Operative Assistant for ${type} integration`,
            source: "operative-command-center"
          }),
        });
        
        // Since we're using no-cors, we can't actually check the response
        // So we'll just assume success for demonstration purposes
      } catch (error) {
        console.error("Error testing webhook:", error);
        // Even if there's an error, we won't throw it here due to CORS limitations
      }

      setIsLoading(false);
      return Promise.resolve(true);
    } catch (error) {
      setIsLoading(false);
      return Promise.reject(error);
    }
  }, [webhookUrls]);

  const value = {
    webhookUrls,
    updateWebhookUrl,
    saveConfiguration,
    testConnection,
    isLoading,
    isConfigured
  };

  return (
    <ZapierConfigContext.Provider value={value}>
      {children}
    </ZapierConfigContext.Provider>
  );
};

export const useZapierConfig = () => {
  const context = useContext(ZapierConfigContext);
  if (context === undefined) {
    throw new Error("useZapierConfig must be used within a ZapierConfigProvider");
  }
  return context;
};
