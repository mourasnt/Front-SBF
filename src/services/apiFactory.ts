import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { IntegrationConfig } from '../config/integrations';

const apiInstances: Map<string, AxiosInstance> = new Map();

/**
 * Create API instance for an integration
 * 
 * Authentication is centralized through Nike API.
 * All integrations use the same JWT token stored in localStorage.
 * Centauro backend validates the token issued by Nike (shared secret or public key).
 */
export function createApiInstance(config: IntegrationConfig): AxiosInstance {
  // Check if instance already exists
  if (apiInstances.has(config.id)) {
    return apiInstances.get(config.id)!;
  }

  const api = axios.create({
    baseURL: config.apiBaseUrl + config.apiPrefix,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add JWT token (shared across all integrations)
  api.interceptors.request.use(
    (reqConfig) => {
      // Always use the shared token from Nike login
      const token = localStorage.getItem('token');
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear shared token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
        localStorage.removeItem('username');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  apiInstances.set(config.id, api);
  return api;
}

export function clearApiInstances(): void {
  apiInstances.clear();
}
