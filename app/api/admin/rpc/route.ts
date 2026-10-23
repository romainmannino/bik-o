import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-session";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Actions admin appelées depuis le navigateur. Les fonctions SQL correspondantes ne sont plus
// ouvertes au public : on vérifie la session admin ici puis on les exécute avec la clé service.
const ALLOWED = new Set([
  "admin_create_store",
  "admin_create_store_invite",
  "admin_revoke_store_invites",
  "admin_upsert_brand_social_monitor",
]);

export async function POST(req: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const fn = String(body.fn || "");
  if (!ALLOWED.has(fn)) return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Clé service Supabase absente" }, { status: 500 });
  const args = body.args && typeof body.args === "object" && !Array.isArray(body.args) ? body.args : {};
  const { data, error } = await admin.rpc(fn, args);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
