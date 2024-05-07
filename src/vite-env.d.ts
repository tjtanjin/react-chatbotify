/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THEME_BASE_CDN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
