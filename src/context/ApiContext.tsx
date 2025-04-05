// src/context/ApiContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { updateApiBaseUrl, setUseMockApi as setApiClientMockMode } from '../api/client';

interface ApiContextType {
  apiUrl: string;
  setApiUrl: (url: string) => void;
  useMockApi: boolean;
  setUseMockApi: (use: boolean) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function useApiContext() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  // Default to localhost:8080 but allow configuration
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:8080/api');
  // Default to using mock API
  const [useMockApi, setUseMockApi] = useState<boolean>(true);

  // Initialize mock API setting
  useEffect(() => {
    setApiClientMockMode(useMockApi);
  }, []);

  // Update API URL when it changes
  const handleSetApiUrl = (url: string) => {
    setApiUrl(url);
    updateApiBaseUrl(url);
  };

  // Update mock API setting when it changes
  const handleSetUseMockApi = (use: boolean) => {
    setUseMockApi(use);
    setApiClientMockMode(use);
  };

  return (
    <ApiContext.Provider value={{ 
      apiUrl, 
      setApiUrl: handleSetApiUrl, 
      useMockApi, 
      setUseMockApi: handleSetUseMockApi 
    }}>
      {children}
    </ApiContext.Provider>
  );
}