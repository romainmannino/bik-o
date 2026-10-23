// Appel d'une action admin depuis le navigateur, via /api/admin/rpc (session admin vérifiée côté serveur).
// Même forme de retour que supabase.rpc : { data, error }.
export async function adminRpc(fn: string, args: Record<string, unknown> = {}) {
  try {
    const r = await fetch("/api/admin/rpc", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fn, args }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { data: null as any, error: { message: String(j?.error || `Action impossible (${r.status})`) } };
    return { data: j?.data ?? null, error: null };
  } catch (e: any) {
    return { data: null as any, error: { message: String(e?.message || "Réseau indisponible") } };
  }
}
