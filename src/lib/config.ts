// Config layer per le impostazioni bootstrap (disponibili PRIMA della connessione Supabase).
// Priorità: localStorage → env vars Vite → stringa vuota
//
// FUTURE HOOK — Python backend:
// Quando il server Python sarà pronto, rimpiazzare il body di fetchRemoteConfig()
// con una chiamata reale, e invocarla in main.tsx prima del render React:
//
//   export async function fetchRemoteConfig(): Promise<Partial<SupabaseConfig>> {
//     const res = await fetch('/api/config');
//     const json = await res.json();
//     return { url: json.supabase_url, anonKey: json.supabase_anon_key };
//   }

const LS_URL_KEY = "supabase_url";
const LS_KEY_KEY = "supabase_anon_key";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: localStorage.getItem(LS_URL_KEY) || import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: localStorage.getItem(LS_KEY_KEY) || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  };
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  const trimmedUrl = url.trim();
  const trimmedKey = anonKey.trim();
  trimmedUrl ? localStorage.setItem(LS_URL_KEY, trimmedUrl) : localStorage.removeItem(LS_URL_KEY);
  trimmedKey ? localStorage.setItem(LS_KEY_KEY, trimmedKey) : localStorage.removeItem(LS_KEY_KEY);
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(LS_URL_KEY);
  localStorage.removeItem(LS_KEY_KEY);
}

export function isSupabaseConfigValid(config: SupabaseConfig): boolean {
  return config.url.length > 0 && config.anonKey.length > 0;
}
