import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const AUTH_TOKEN_KEY = 'auth-token';
export const RESTAURANT_ID_KEY = 'selected-restaurant-id';

export const setAuthToken = (token: string) => {
  setCookie(AUTH_TOKEN_KEY, token, { maxAge: 60 * 60 * 24 }); // 24 hours
};

export const getAuthToken = () => {
  return getCookie(AUTH_TOKEN_KEY);
};

export const setRestaurantId = (id: string) => {
  setCookie(RESTAURANT_ID_KEY, id, { maxAge: 60 * 60 * 24 }); // 24 hours
};

export const getRestaurantId = () => {
  return getCookie(RESTAURANT_ID_KEY);
};

export const clearAuth = () => {
  deleteCookie(AUTH_TOKEN_KEY);
  deleteCookie(RESTAURANT_ID_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
