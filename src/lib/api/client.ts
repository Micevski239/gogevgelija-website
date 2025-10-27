import axios from 'axios';
import { ensureTokensLoaded, getAccess, getRefresh, saveTokens } from '../auth/tokens';

// Get API URL from environment variable
const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccess(): Promise<string | null> {
  if (refreshing) return refreshing;

  await ensureTokensLoaded();
  const r = getRefresh();
  if (!r) return null;

  refreshing = api
    .post('/api/token/refresh/', { refresh: r })
    .then(async ({ data }) => {
      await saveTokens(data.access, r);
      return data.access as string;
    })
    .catch(async () => {
      await saveTokens(undefined, undefined);
      return null;
    })
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

// Request interceptor to add auth token and language header
api.interceptors.request.use(async (config) => {
  await ensureTokensLoaded();
  const token = getAccess();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add language header
  // Try to get from localStorage or use default
  if (typeof window !== 'undefined') {
    const currentLanguage = localStorage.getItem('gogevgelija_language') || 'en';
    config.headers['Accept-Language'] = currentLanguage;
  }

  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // If 401 and we haven't retried yet, try refreshing the token
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const newAccess = await refreshAccess();

      if (newAccess) {
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      }
    }

    return Promise.reject(error);
  }
);
