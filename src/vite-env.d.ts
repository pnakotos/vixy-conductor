/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_BASE_URL?: string;
  readonly VIXY_INTERCONNECTION_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
