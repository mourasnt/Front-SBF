import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IntegrationConfig } from '../config/integrations';
import { getIntegration, DEFAULT_INTEGRATION } from '../config/integrations';

interface IntegrationContextType {
  currentIntegration: IntegrationConfig;
  setIntegration: (id: string) => void;
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

export const IntegrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentIntegration, setCurrentIntegration] = useState<IntegrationConfig>(() => {
    const saved = localStorage.getItem('currentIntegration');
    return getIntegration(saved || DEFAULT_INTEGRATION);
  });

  const setIntegration = (id: string) => {
    const integration = getIntegration(id);
    setCurrentIntegration(integration);
    localStorage.setItem('currentIntegration', id);
  };

  useEffect(() => {
    const saved = localStorage.getItem('currentIntegration');
    if (saved) {
      setCurrentIntegration(getIntegration(saved));
    }
  }, []);

  return (
    <IntegrationContext.Provider value={{ currentIntegration, setIntegration }}>
      {children}
    </IntegrationContext.Provider>
  );
};

export const useIntegration = (): IntegrationContextType => {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error('useIntegration must be used within an IntegrationProvider');
  }
  return context;
};
