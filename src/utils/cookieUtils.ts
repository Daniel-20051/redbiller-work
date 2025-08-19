/**
 * Cookie utility functions for managing authentication tokens
 * Tokens expire after 5 hours as requested
 */

const AUTH_TOKEN_KEY = 'authToken';
const TOKEN_EXPIRY_HOURS = 2;

/**
 * Set a cookie with the auth token that expires in 5 hours
 */
export const setAuthToken = (token: string): void => {
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + (TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)); // 5 hours in milliseconds
  
  const cookieValue = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`;
  document.cookie = cookieValue;
};

/**
 * Get the auth token from cookies
 */
export const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === AUTH_TOKEN_KEY) {
      return decodeURIComponent(value);
    }
  }
  
  return null;
};

/**
 * Remove the auth token cookie
 */
export const removeAuthToken = (): void => {
  // Set the cookie to expire in the past to delete it
  document.cookie = `${AUTH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Check if the user is authenticated (has a valid token)
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Utility function to parse all cookies into an object
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  
  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }
  
  return cookies;
};
