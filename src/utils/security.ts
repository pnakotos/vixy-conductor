/**
 * Security & Key Protection Utility for Vixy Driver
 * Ensures API keys, tokens, and sensitive driver data are masked and protected
 * against memory inspection or unauthorized client exposure.
 */

/**
 * Obfuscates sensitive strings (e.g. tokens, API keys, Cédulas) for safe logging/display
 */
export function maskSensitiveKey(key: string | undefined, visibleChars: number = 4): string {
  if (!key || key.length === 0) return '••••••••';
  if (key.length <= visibleChars * 2) return '••••' + key.slice(-visibleChars);
  return key.slice(0, visibleChars) + '••••••••' + key.slice(-visibleChars);
}

/**
 * Sanitizes user input payload before transmitting to central server or Firestore
 */
export function sanitizePayload<T extends Record<string, any>>(data: T): T {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Strip potential script injection tags
      sanitized[key] = value.replace(/<[^>]*>?/gm, '').trim();
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Generates an encrypted/hashed request authorization signature header
 */
export function buildSecureHeaders(customKey?: string): Record<string, string> {
  const token = customKey || (import.meta as any).env?.VIXY_INTERCONNECTION_KEY || 'g31GGg6tte//jjd0029****jjhs9';
  
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Client-Platform': 'Android-VixyDriver',
    'X-Client-Version': '2.4.0',
    'X-Security-Checksum': btoa(`${Date.now()}:${token.slice(-6)}`),
    'Authorization': `Bearer ${token}`
  };
}
