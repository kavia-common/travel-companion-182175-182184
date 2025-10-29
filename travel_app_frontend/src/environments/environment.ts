export type Environment = {
  production: boolean;
  // PUBLIC_INTERFACE
  // Supabase URL for the project (e.g., https://xyzcompany.supabase.co)
  supabaseUrl: string | undefined;
  // PUBLIC_INTERFACE
  // Supabase anon/public key
  supabaseKey: string | undefined;
};

/**
 * PUBLIC_INTERFACE
 * Default environment for production builds.
 * Values are read from process.env so they can be provided via .env file or host environment at build/runtime.
 * On the server (SSR) process.env is available. On the browser, Vite/Angular builder may inline environment values.
 */
export const environment: Environment = {
  production: true,
  supabaseUrl: (typeof process !== 'undefined' && process?.env && (process.env as any)['NG_APP_SUPABASE_URL']) || undefined,
  supabaseKey: (typeof process !== 'undefined' && process?.env && (process.env as any)['NG_APP_SUPABASE_KEY']) || undefined,
};
