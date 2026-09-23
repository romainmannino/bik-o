"use client";
import { useMemo, useState } from "react";
import { createClient } from "../lib/supabase/client";

export default function BrandManager({store,allBrands,selected}:{store:any;allBrands:any[];selected:any[]}) {
  const [busy,setBusy]=useState<string|null>(null);
  const [selectedIds,setSelectedIds]=useState<string[]>(selected.map((b:any)=>b.id));
  const [brandToAdd,setBrandToAdd]=useState("");
  const available=useMemo(()=>allBrands.filter((b:any)=>!selectedIds.includes(b.id)),[allBrands,selectedIds]);

  async function toggle(b:any,enabled:boolean) {
    setBusy(b.id);
    const supabase=createClient();
    const {error}=await supabase.rpc("set_store_brand",{p_store_slug:store.slug,p_brand_id:b.id,p_enabled:enabled,p_logo_override_url:null});
    if(error) alert(error.message);
    else setSelectedIds(ids=>enabled?[...ids,b.id]:ids.filter(id=>id!==b.id));
    setBusy(null);
  }

  async function addSelectedBrand() {
    const b=allBrands.find((x:any)=>x.id===brandToAdd);
    if(!b) return;
    await toggle(b,true);
    setBrandToAdd("");
  }

  async function uploadLogo(b:any,file:File) {
    setBusy(b.id);
    const body=new FormData(); body.append("file",file); body.append("kind","brand-"+b.slug);
    const res=await fetch("/api/storefront/upload",{method:"POST",body});
    const out=await res.json();
    if(!res.ok){alert(out.error);setBusy(null);return}
    const supabase=createClient();
    const {error}=await supabase.rpc("set_store_brand_logo",{p_store_slug:store.slug,p_brand_id:b.id,p_logo_url:out.url});
    if(error) alert(error.message); else location.reload();
    setBusy(null);
  }

  const activeBrands=allBrands.filter((b:any)=>selectedIds.includes(b.id));
  return <div className="brandManager">
    <div className="brandIntro">
      <small>CATALOGUE MARQUES BIKÉO</small>
      <h2>Les marques de mon magasin</h2>
      <p>Choisis uniquement dans le référentiel Bikéo. Les logos sont mutualisés : dès qu’un logo officiel est renseigné, il est proposé à tous les magasins.</p>
      <div className="brandCreate">
        <select value={brandToAdd} onChange={e=>setBrandToAdd(e.target.value)}>
          <option value="">Sélectionner une marque…</option>
          {available.map((b:any)=><option value={b.id} key={b.id}>{b.name}</option>)}
        </select>
        <button type="button" disabled={!brandToAdd||busy!==null} onClick={addSelectedBrand}>+ Ajouter au magasin</button>
      </div>
    </div>
    <div className="brandManageGrid">
      {activeBrands.map((b:any)=>{
        const sel=selected.find((x:any)=>x.id===b.id);
        const logo=sel?.logo_url||b.logo_url;
        return <article className="active" key={b.id}>
          <div className="brandLogoBox">{logo?<img src={logo} alt={b.name}/>:<b>{b.name}</b>}</div>
          <h3>{b.name}</h3>
          <button type="button" disabled={busy===b.id} onClick={()=>toggle(b,false)}>✓ Marque active · Retirer</button>
          <label className="brandLogoUpload">Logo de la marque
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={e=>e.target.files?.[0]&&uploadLogo(b,e.target.files[0])}/>
            <span>{logo?"Remplacer le logo proposé":"Importer le logo officiel"}</span>
          </label>
        </article>
      })}
    </div>
  </div>;
}