export interface AppConfig {
  appName: string;
  appSubtitle: string;
  logoUrl: string;
  debugMode: boolean;
  interconnectionKey: string;
  adminBaseUrl: string;
}

const STORAGE_KEY = 'vixy_app_config';

const DEFAULT_CONFIG: AppConfig = {
  appName: 'Vixy Driver',
  appSubtitle: 'Servicios y movilidad en Venezuela',
  logoUrl: '/images/vixy-brand.svg',
  debugMode: false,
  interconnectionKey: '',
  adminBaseUrl: 'https://www.vhixy.site',
};

function resolveAdminBaseUrl(value?: string): string {
  const candidate = value?.trim();
  if (!candidate) {
    return DEFAULT_CONFIG.adminBaseUrl;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:') {
      return DEFAULT_CONFIG.adminBaseUrl;
    }
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_CONFIG.adminBaseUrl;
  }
}

function readEnvValue(key: string): string | undefined {
  try {
    return (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.[key];
  } catch {
    return undefined;
  }
}

export function loadAppConfig(): AppConfig {
  if (typeof window === 'undefined') {
    return {
      ...DEFAULT_CONFIG,
      appName: readEnvValue('VITE_APP_NAME') || DEFAULT_CONFIG.appName,
      appSubtitle: readEnvValue('VITE_APP_SUBTITLE') || DEFAULT_CONFIG.appSubtitle,
      logoUrl: readEnvValue('VITE_APP_LOGO_URL') || DEFAULT_CONFIG.logoUrl,
      debugMode: readEnvValue('VITE_DEBUG_MODE') === 'true' || DEFAULT_CONFIG.debugMode,
      interconnectionKey: readEnvValue('VITE_INTERCONNECTION_KEY') || DEFAULT_CONFIG.interconnectionKey,
      adminBaseUrl: resolveAdminBaseUrl(readEnvValue('VITE_ADMIN_BASE_URL')),
    };
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<AppConfig>;
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        appName: parsed.appName || readEnvValue('VITE_APP_NAME') || DEFAULT_CONFIG.appName,
        appSubtitle: parsed.appSubtitle || readEnvValue('VITE_APP_SUBTITLE') || DEFAULT_CONFIG.appSubtitle,
        logoUrl: parsed.logoUrl || readEnvValue('VITE_APP_LOGO_URL') || DEFAULT_CONFIG.logoUrl,
        debugMode: parsed.debugMode ?? (readEnvValue('VITE_DEBUG_MODE') === 'true' || DEFAULT_CONFIG.debugMode),
        interconnectionKey: parsed.interconnectionKey || readEnvValue('VITE_INTERCONNECTION_KEY') || DEFAULT_CONFIG.interconnectionKey,
        adminBaseUrl: resolveAdminBaseUrl(parsed.adminBaseUrl || readEnvValue('VITE_ADMIN_BASE_URL')),
      };
    }
  } catch {
    // Fall back to defaults when storage is unavailable or unreadable.
  }

  return {
    ...DEFAULT_CONFIG,
    appName: readEnvValue('VITE_APP_NAME') || DEFAULT_CONFIG.appName,
    appSubtitle: readEnvValue('VITE_APP_SUBTITLE') || DEFAULT_CONFIG.appSubtitle,
    logoUrl: readEnvValue('VITE_APP_LOGO_URL') || DEFAULT_CONFIG.logoUrl,
    debugMode: readEnvValue('VITE_DEBUG_MODE') === 'true' || DEFAULT_CONFIG.debugMode,
    interconnectionKey: readEnvValue('VITE_INTERCONNECTION_KEY') || DEFAULT_CONFIG.interconnectionKey,
    adminBaseUrl: resolveAdminBaseUrl(readEnvValue('VITE_ADMIN_BASE_URL')),
  };
}

export function saveAppConfig(config: Partial<AppConfig>): AppConfig {
  const nextConfig = {
    ...loadAppConfig(),
    ...config,
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConfig));
  }

  return nextConfig;
}
