/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_BASE_URL?: string;
  readonly VITE_INTERCONNECTION_KEY?: string;
  readonly VITE_DEBUG_MODE?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_SUBTITLE?: string;
  readonly VITE_APP_LOGO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
