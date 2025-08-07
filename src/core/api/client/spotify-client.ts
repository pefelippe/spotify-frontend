import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface SpotifyApiConfig {
  baseURL: string;
  timeout?: number;
}

export class SpotifyClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(config: SpotifyApiConfig = { baseURL: 'https://api.spotify.com/v1' }) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
    });
  }

  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearToken(): void {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(endpoint, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(endpoint, config);
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Singleton instance
export const spotifyClient = new SpotifyClient();

// Legacy exports for backward compatibility
export const setSpotifyToken = (token: string) => spotifyClient.setToken(token);
export default spotifyClient; 