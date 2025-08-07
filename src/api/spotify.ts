import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});

export const setSpotifyToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;
