import { createClient } from "@supabase/supabase-js";

// Client serveur avec la clé service : uniquement pour les tâches système (cron, imports),
// jamais exposé au navigateur. Renvoie null si la clé n'est pas configurée.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
