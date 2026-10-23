import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminSession } from "@/lib/admin-session";
import { runMonitor } from "@/lib/facebook-monitor";

export const runtime = "nodejs";
// Une collecte Bright Data dépasse souvent la minute : on laisse le temps d'attendre le snapshot.
export const maxDuration = 300;

export async function POST(req: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const deadline = Date.now() + 280000;
  const s = await createClient();
  let b: any = {};
  try {
    b = await req.json();
  } catch {}
  const brandId = String(b.brandId || "");
  if (!brandId) return NextResponse.json({ error: "Marque manquante" }, { status: 400 });
  const { data: m, error: me } = await s.rpc("admin_list_brand_social_monitors");
  if (me) return NextResponse.json({ error: me.message }, { status: 500 });
  const mon = (m || []).find((x: any) => x.brand_id === brandId);
  if (!mon?.facebook_page_url) return NextResponse.json({ error: "URL Facebook manquante" }, { status: 400 });
  const days = Number(b.days) > 0 ? Math.min(31, Number(b.days)) : 4;
  const result = await runMonitor(s, brandId, mon.facebook_page_url, deadline, days);
  const status = result.ok ? 200 : result.noRecords ? 502 : 500;
  return NextResponse.json(result, { status });
}
