"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Bike = {
  id: string; slug: string; brand?: string; year?: string | number; category?: string;
  name: string; price?: number; image?: string | null; statusKey?: string; status?: string;
  availableVariants?: Array<{ size?: string; color?: string; qty?: number }>;
};

export default function PublicCatalogueFilters({ bikes, storeSlug }: { bikes: Bike[]; storeSlug: string }) {
  const [q,setQ]=useState(""); const [brand,setBrand]=useState(""); const [year,setYear]=useState("");
  const [cat,setCat]=useState(""); const [max,setMax]=useState(""); const [open,setOpen]=useState<string|null>(null);
  const brands=Array.from(new Set(bikes.map(b=>b.brand).filter(Boolean))) as string[];
  const years=Array.from(new Set(bikes.map(b=>b.year).filter(Boolean).map(String)));
  const cats=Array.from(new Set(bikes.map(b=>b.category).filter(Boolean))) as string[];
  const list=useMemo(()=>bikes.filter(b=>{
    const search=!q||((b.brand||"")+" "+b.name).toLowerCase().includes(q.toLowerCase());
    return search&&(!brand||b.brand===brand)&&(!year||String(b.year)===year)&&(!cat||b.category===cat)&&(!max||!b.price||b.price<=Number(max)*100);
  }),[bikes,q,brand,year,cat,max]);
  const euro=(c?:number)=>c?new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(c/100):"Prix sur demande";

  return (
    <section className="publicCatalogBody">
      <div className="catalogLayout">
        <aside className="publicFilters">
          <label><span>Rechercher</span><input placeholder="Nom du modèle…" value={q} onChange={e=>setQ(e.target.value)} /></label>
          <label><span>Marque</span><select value={brand} onChange={e=>setBrand(e.target.value)}><option value="">Toutes les marques</option>{brands.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
          <label><span>Année de gamme</span><select value={year} onChange={e=>setYear(e.target.value)}><option value="">Toutes les années</option>{years.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
          <label><span>Pratique</span><select value={cat} onChange={e=>setCat(e.target.value)}><option value="">Toutes les pratiques</option>{cats.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
          <label><span>Budget maximum</span><input type="number" placeholder="Prix max €" value={max} onChange={e=>setMax(e.target.value)} /></label>
          {(q||brand||year||cat||max)&&<button type="button" className="clearFilters" onClick={()=>{setQ("");setBrand("");setYear("");setCat("");setMax("")}}>Effacer les filtres</button>}
        </aside>
        <div className="catalogResults">
          <p className="catalogCount">{list.length} modèle{list.length>1?"s":""}</p>
          <div className="publicBikeGrid">
        {list.map(bike=>{
          const isOpen=open===bike.id; const variants=bike.availableVariants||[];
          return (
            <article className="publicBikeCard" key={bike.id}>
              <Link className="bikeCardLink" href={`/magasin/${storeSlug}/velos/${bike.slug}`}>
                <div className="publicBikeImage">{bike.image?<img src={bike.image} alt={bike.name}/>:<span>PHOTO EPOS</span>}</div>
                <small>{bike.brand} · {bike.year}</small><h2>{bike.name}</h2><p>{bike.category}</p><strong>{euro(bike.price)}</strong>
              </Link>
              {bike.statusKey==="in_stock" ? (
                <div className="stockControl">
                  <button type="button" className="stockBadge in_stock stockToggle" onClick={()=>setOpen(isOpen?null:bike.id)}>Disponible en magasin ▾</button>
                  {isOpen ? <div className="stockPopover"><b>Tailles et couleurs disponibles</b>{variants.map((v,i)=><span key={i}><strong>{v.size||"—"}</strong>{" · "}{v.color||"—"}{v.qty&&v.qty>1?` (${v.qty})`:""}</span>)}</div> : null}
                </div>
              ) : <em className={`stockBadge ${bike.statusKey||""}`}>{bike.status}</em>}
            </article>
          );
        })}
          </div>
        </div>
      </div>
    </section>
  );
}
