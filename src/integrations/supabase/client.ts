// NOTA: Questo file è stato esteso per supportare configurazione runtime via src/lib/config.ts.
// Non ripristinare le costanti hardcodate alle env vars.
//
// import { supabase } from "@/integrations/supabase/client";

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabaseConfig } from '@/lib/config';

function buildClient(): SupabaseClient<Database> {
  const { url, anonKey } = getSupabaseConfig();
  return createClient<Database>(url, anonKey, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export let supabase: SupabaseClient<Database> = buildClient();

/**
 * Ricostruisce il client Supabase con la configurazione aggiornata da localStorage.
 * I consumer che già importano { supabase } tengono il vecchio riferimento:
 * è richiesto un page reload per applicare la nuova connessione a tutta l'app.
 */
export function reinitializeSupabaseClient(): void {
  supabase = buildClient();
}
