/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONGO_URI: string;
  readonly VITE_JWT_SECRET: string;
  readonly VITE_CORS_DOMAINS: string;
  readonly VITE_REDUX_PERSIST_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
