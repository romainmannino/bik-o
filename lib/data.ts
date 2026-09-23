import { createClient } from "./supabase/server";

export async function getDemoStore() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("stores").select("*").eq("slug","cycles-omega").single();
  if (error) throw error;
  return data;
}

export async function getCatalog() {
  const supabase = await createClient();
  const store = await getDemoStore();
  const { data: links } = await supabase.from("store_brands").select("brand_id").eq("store_id",store.id);
  const brandIds=(links??[]).map(x=>x.brand_id);
  if(!brandIds.length) return [];
  const { data, error } = await supabase.from("products").select("*, brands(name), product_variants(id,size,color,ean,sku,inventory(quantity,price_cents,public_status,last_synced_at,source))").in("brand_id",brandIds).eq("is_active",true).order("name");
  if(error) throw error;
  return data??[];
}

export async function getStoreStats(){
  const products=await getCatalog();
  const variants=products.flatMap((p:any)=>p.product_variants??[]);
  const inventory=variants.flatMap((v:any)=>v.inventory??[]);
  return {
    products:products.length,
    inStock:inventory.filter((i:any)=>i.public_status==="in_stock" && i.quantity>0).reduce((n:number,i:any)=>n+i.quantity,0),
    orderable:inventory.filter((i:any)=>i.public_status==="orderable").length,
    lastSync: inventory.map((i:any)=>i.last_synced_at).filter(Boolean).sort().at(-1)??null
  };
}
