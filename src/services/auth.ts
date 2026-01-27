import api from './api';
import type { LoginRequest, LoginResponse } from '../types';

/**
 * Authentication Service
 * 
 * Login is centralized through Nike API.
 * The JWT token is shared across all integrations.
 * Centauro backend should be configured to validate tokens issued by Nike.
 */
export const authService = {
  /**
   * Login through Nike API (centralized authentication)
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/autenticacao', credentials);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('username');
    localStorage.removeItem('currentIntegration');
  },

  saveToken(token: string, expiration: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('token_expiration', expiration);
    localStorage.setItem('username', username);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) return true;
    
    const expirationDate = new Date(expiration);
    return expirationDate <= new Date();
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  },

  /**
   * Decode JWT token payload (without verification)
   * Used by Centauro to extract user info from the token
   */
  decodeToken(): Record<string, any> | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  /**
   * Get user info from decoded token
   */
  getUserFromToken(): { username?: string; exp?: number; [key: string]: any } | null {
    return this.decodeToken();
  },
};
