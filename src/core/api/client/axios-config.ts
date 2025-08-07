import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('spotify_token');

      window.dispatchEvent(new CustomEvent('spotify-unauthorized'));

      if (window.spotifyUnauthorizedCallback) {
        window.spotifyUnauthorizedCallback();
      }
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
