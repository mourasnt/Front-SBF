/**
 * Configuration file for different integrations
 * This makes it easy to add new integrations and configure deployment
 * 
 * AUTHENTICATION:
 * - Login is centralized through Nike API
 * - JWT token is shared across all integrations
 * - Centauro backend validates tokens using the same secret/key as Nike
 */

export interface IntegrationConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  apiBaseUrl: string;
  apiPrefix: string;
  /** Whether this integration is the auth provider (only Nike) */
  isAuthProvider: boolean;
  color: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  features: {
    uploadXml: boolean;
    updateStatus: boolean;
    tracking: boolean;
  };
}

/** Nike API URL - used for centralized authentication */
export const AUTH_API_URL = import.meta.env.VITE_NIKE_API_URL || 'http://localhost:8000';

export const INTEGRATIONS: Record<string, IntegrationConfig> = {
  nike: {
    id: 'nike',
    name: 'Nike',
    displayName: 'Nike',
    description: 'Gestão de Cargas Nike',
    apiBaseUrl: import.meta.env.VITE_NIKE_API_URL || 'http://localhost:8000',
    apiPrefix: '',
    isAuthProvider: true, // Nike handles authentication
    color: {
      primary: 'blue',
      secondary: 'cyan',
      gradient: 'from-blue-600 via-blue-500 to-cyan-500',
    },
    features: {
      uploadXml: true,
      updateStatus: true,
      tracking: true,
    },
  },
  centauro: {
    id: 'centauro',
    name: 'Centauro',
    displayName: 'Centauro',
    description: 'Gestão de Cargas Centauro',
    apiBaseUrl: import.meta.env.VITE_CENTAURO_API_URL || 'http://localhost:8001',
    apiPrefix: '/api/v2',
    isAuthProvider: false, // Uses token from Nike
    color: {
      primary: 'orange',
      secondary: 'amber',
      gradient: 'from-orange-600 via-orange-500 to-amber-500',
    },
    features: {
      uploadXml: true,
      updateStatus: true,
      tracking: true,
    },
  },
};

export const DEFAULT_INTEGRATION = 'nike';

/** Get the auth provider integration (Nike) */
export function getAuthProvider(): IntegrationConfig {
  return INTEGRATIONS.nike;
}

export function getIntegration(id: string): IntegrationConfig {
  return INTEGRATIONS[id] || INTEGRATIONS[DEFAULT_INTEGRATION];
}

export function getAllIntegrations(): IntegrationConfig[] {
  return Object.values(INTEGRATIONS);
}
