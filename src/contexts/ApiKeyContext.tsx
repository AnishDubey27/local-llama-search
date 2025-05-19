
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ApiKeyContextProps {
  braveApiKey: string;
  setBraveApiKey: (key: string) => void;
}

interface ApiKeyProviderProps {
  children: ReactNode;
  defaultBraveApiKey?: string;
}

const ApiKeyContext = createContext<ApiKeyContextProps | undefined>(undefined);

export const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children, defaultBraveApiKey = '' }) => {
  const [braveApiKey, setBraveApiKey] = useState<string>(defaultBraveApiKey);

  return (
    <ApiKeyContext.Provider value={{ braveApiKey, setBraveApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextProps => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
