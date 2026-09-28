"use client";
import Link from "next/link";
import {useRef,useState} from "react";
import {createClient} from "../lib/supabase/client";

export default function DashboardQuickActions({storeId}:{storeId:string}){
 const input=useRef<HTMLInputElement>(null),[busy,setBusy]=useState(false);
 async function addPhoto(file?:File){if(!file)return;setBusy(true);try{const fd=new FormData();fd.append("file",file);const r=await fetch("/api/social/upload",{method:"POST",body:fd});const x=await r.json();if(!r.ok)throw new Error(x.error||"Upload impossible");const s=createClient();const{error}=await s.from("social_photos").insert({store_id:storeId,url:x.url,status:"available"});if(error)throw error;location.href="/dashboard/reseaux-sociaux"}catch(e:any){alert(e.message||"Ajout impossible");setBusy(false)}}
 const card:React.CSSProperties={display:"flex",alignItems:"center",gap:12,padding:"16px 18px",border:"1px solid #dfe4df",borderRadius:16,background:"#fff",color:"#171a19",textDecoration:"none",fontWeight:700,minHeight:68,cursor:"pointer"};
 return <section style={{margin:"0 0 24px"}}><div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:12,marginBottom:10}}><div><small style={{letterSpacing:".12em",fontWeight:800,color:"#159b75"}}>ACTIONS RAPIDES</small><h2 style={{margin:"4px 0 0"}}>En magasin</h2></div><span style={{fontSize:13,color:"#68706b"}}>1 clic → l’action</span></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:10}}>
 <Link href="/dashboard/plv?scan=1#qr-config" style={card}><span style={{fontSize:25}}>⌁</span><span>Scanner une affiche PLV<small style={{display:"block",fontWeight:500,color:"#68706b"}}>Associer rapidement un vélo</small></span></Link>
 <Link href="/dashboard/fidelite?action=scan" style={card}><span style={{fontSize:24}}>♡</span><span>Scanner une carte fidélité<small style={{display:"block",fontWeight:500,color:"#68706b"}}>Créditer le client</small></span></Link>
 <label style={card}><span style={{fontSize:24}}>＋</span><span>{busy?"Ajout de la photo…":"Ajouter une photo"}<small style={{display:"block",fontWeight:500,color:"#68706b"}}>Caméra ou photothèque · Réseaux sociaux</small></span><input ref={input} type="file" accept="image/*" style={{display:"none"}} disabled={busy} onChange={e=>addPhoto(e.target.files?.[0])}/></label>
 </div></section>
}