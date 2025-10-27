// Token management for web using localStorage
// Adapted from mobile app's SecureStore implementation

let mem: { access?: string; refresh?: string; guestId?: string } = {};
let memLoaded = false;

const STORAGE_KEYS = {
  ACCESS: 'gogevgelija_access_token',
  REFRESH: 'gogevgelija_refresh_token',
  GUEST_ID: 'gogevgelija_guest_id',
};

export async function loadTokens() {
  if (typeof window === 'undefined') {
    // Server-side: return empty
    return mem;
  }

  const access = localStorage.getItem(STORAGE_KEYS.ACCESS);
  const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH);
  const guestId = localStorage.getItem(STORAGE_KEYS.GUEST_ID);

  mem = {
    access: access ?? undefined,
    refresh: refresh ?? undefined,
    guestId: guestId ?? undefined
  };
  memLoaded = true;
  return mem;
}

export async function saveTokens(access?: string, refresh?: string) {
  mem = { ...mem, access, refresh };
  memLoaded = true;

  if (typeof window === 'undefined') return;

  if (access) {
    localStorage.setItem(STORAGE_KEYS.ACCESS, access);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACCESS);
  }

  if (refresh) {
    localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REFRESH);
  }
}

export async function saveGuestId(guestId?: string) {
  mem = { ...mem, guestId };
  memLoaded = true;

  if (typeof window === 'undefined') return;

  if (guestId) {
    localStorage.setItem(STORAGE_KEYS.GUEST_ID, guestId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.GUEST_ID);
  }
}

export const getGuestId = () => mem.guestId;

export async function getGuestIdAsync() {
  await ensureLoaded();
  return mem.guestId;
}

async function ensureLoaded() {
  if (!memLoaded) {
    await loadTokens();
  }
}

export const getAccess = () => mem.access;
export const getRefresh = () => mem.refresh;

export async function getAccessToken() {
  await ensureLoaded();
  return mem.access;
}

export async function getRefreshToken() {
  await ensureLoaded();
  return mem.refresh;
}

export const ensureTokensLoaded = ensureLoaded;

// Simple JWT decode function to extract user info
export function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Use atob for browser compatibility
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export async function getUserFromToken() {
  await ensureLoaded();
  const token = mem.access;
  if (!token) return null;

  const payload = decodeJWT(token);
  if (!payload) return null;

  return {
    username: payload.username || payload.sub || 'User',
    email: payload.email,
    userId: payload.user_id || payload.id,
  };
}

// Clear all auth data
export async function clearAuth() {
  mem = {};
  memLoaded = true;

  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.ACCESS);
  localStorage.removeItem(STORAGE_KEYS.REFRESH);
  localStorage.removeItem(STORAGE_KEYS.GUEST_ID);
}
