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
 * Resolve environment variables in both browser and SSR:
 * - In browser, read from globalThis (e.g., window.NG_APP_SUPABASE_URL) which can be injected at runtime by host.
 * - In SSR/Node, read from process.env.
 */
function readEnvVar(name: string): string | undefined {
  try {
    const g: any = typeof globalThis !== 'undefined' ? globalThis : undefined;
    // Prefer browser globals if available
    if (g && typeof g === 'object' && typeof g.window !== 'undefined') {
      const w = g.window as any;
      if (w && typeof w[name] === 'string' && w[name]) {
        return w[name] as string;
      }
      // Also allow access directly off globalThis
      if (typeof (g as any)[name] === 'string' && (g as any)[name]) {
        return (g as any)[name] as string;
      }
    }
    // Fallback to process.env for SSR/Node
    if (typeof process !== 'undefined' && (process as any).env) {
      const v = ((process as any).env as any)[name];
      if (typeof v === 'string' && v) return v as string;
    }
  } catch {
    // ignore and return undefined
  }
  return undefined;
}

/**
 * PUBLIC_INTERFACE
 * Default environment for production builds.
 * Reads from browser global injection first, then process.env on SSR.
 */
export const environment: Environment = {
  production: true,
  supabaseUrl: readEnvVar('NG_APP_SUPABASE_URL'),
  supabaseKey: readEnvVar('NG_APP_SUPABASE_KEY'),
};
