import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { iso, addDays, runMonitor } from "@/lib/facebook-monitor";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== "Bearer " + secret)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const startedAt = Date.now();
  // Garde ~20 s de marge sous maxDuration pour enregistrer les résultats.
  const deadline = startedAt + 280000;
  const s = await createClient();
  const { data: monitors, error } = await (createAdminClient()||s).rpc("cron_list_enabled_brand_social_monitors");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Les marques sont collectées en parallèle : chacune peut attendre son snapshot Bright Data.
  const summary = await Promise.all(
    (monitors || []).map(async (mon: any) => ({
      brandId: mon.brand_id,
      ...(await runMonitor(s, mon.brand_id, mon.facebook_page_url, deadline)),
    })),
  );
  return NextResponse.json({
    ok: true,
    date: iso(addDays(new Date(), -1)),
    brands: summary.length,
    failed: summary.filter((x) => !x.ok).length,
    durationMs: Date.now() - startedAt,
    summary,
  });
}
