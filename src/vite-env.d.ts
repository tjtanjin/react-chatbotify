/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

type ImportMetaEnv = {
  readonly VITE_THEME_BASE_CDN_URL: string;
  readonly VITE_THEME_DEFAULT_CACHE_EXPIRATION: number;
  readonly VITE_THEME_CACHE_KEY_PREFIX: string;
}

type ImportMeta = {
  readonly env: ImportMetaEnv;
}
