/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THEME_BASE_CDN_URL: string;
  readonly VITE_THEME_DEFAULT_CACHE_EXPIRATION: number;
  readonly VITE_THEME_CACHE_KEY_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
