import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('spotify_token');
      sessionStorage.removeItem('spotify_token_scopes');

      window.dispatchEvent(new CustomEvent('spotify-unauthorized'));

      if (window.spotifyUnauthorizedCallback) {
        window.spotifyUnauthorizedCallback();
      }
    } else if (error.response?.status === 403) {
      console.warn('403 Forbidden - Token may not have required scopes');
      // Don't automatically logout for 403 errors as they're permission-related, not auth-related
      // The scope check in AuthProvider will handle this case
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

declare global {
  interface Window {
    spotifyUnauthorizedCallback?: () => void;
  }
}
