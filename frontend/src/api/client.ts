import { UserProfile } from '../types';

export class ApiClient {
  private static tokenKey = 'careermatch_token';

  static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  static setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  static clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error?.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  static async checkHealth() {
    return this.request<{ status: string; app: string }>('/health');
  }

  static async checkReady() {
    return this.request<{ status: string; database: string; pgvector: boolean }>('/ready');
  }

  static async uploadResume(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<UserProfile>('/api/profile/resume', {
      method: 'POST',
      body: formData,
    });
  }

  static async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/api/profile');
  }

  static async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
}
