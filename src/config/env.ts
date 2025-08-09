export const env = {
  API_URL: (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, ''),
} as const;

export type Env = typeof env;
