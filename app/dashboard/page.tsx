import Link from "next/link";
import {createClient} from "../../lib/supabase/server";
import {redirect} from "next/navigation";
export const dynamic="force-dynamic";

export default async function Dashboard(){
 const supabase=await createClient();
 const{data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/connexion");
 const{data:membership}=await supabase.from("store_members").select("store_id").eq("user_id",user.id).limit(1).maybeSingle();
 if(!membership)redirect("/connexion?access=missing");
 const{data:store}=await supabase.from("stores").select("*").eq("id",membership.store_id).maybeSingle();
 if(!store)redirect("/connexion?access=missing");

 const [socialResult,qrResult,loyaltyResult]=await Promise.all([
   supabase.from("brand_social_store_variants").select("id",{count:"exact",head:true}).eq("store_id",store.id).eq("status","available"),
   supabase.from("store_qr_codes").select("id,product_id").eq("store_id",store.id),
   supabase.from("store_loyalty_integrations").select("status").eq("store_id",store.id).maybeSingle()
 ]);
 const socialCount=socialResult.count??0;
 const qrs=qrResult.data??[];
 const configured=qrs.filter((q:any)=>q.product_id).length;
 const pending=qrs.length-configured;
 const loyaltyActive=loyaltyResult.data?.status==="active"||loyaltyResult.data?.status==="provisioned";

 const cards=[
  {icon:"▣",eyebrow:"MON SITE",title:store.is_published?"En ligne":"Pré-configuré",detail:store.is_published?"Ton site est visible par tes clients.":"Ton site Bikéo est prêt à être publié.",action:store.is_published?"Voir mon site →":"Mettre en ligne →",href:store.is_published?("/magasin/"+store.slug):"/dashboard/site"},
  {icon:"◎",eyebrow:"RÉSEAUX SOCIAUX",title:socialCount+" post"+(socialCount>1?"s":"")+" disponible"+(socialCount>1?"s":""),detail:"Contenus de tes marques disponibles dans la marketplace.",action:"+ Ajouter une photo →",href:"/dashboard/reseaux-sociaux?add=photo"},
  {icon:"♡",eyebrow:"PROGRAMME FIDÉLITÉ",title:loyaltyActive?"Actif · 5 %":"Pré-configuré · 5 %",detail:"Cagnotte fidélité Bikéo propulsée par Digifyd.",action:"Scanner une carte fidélité →",href:"/dashboard/fidelite?action=scan"},
  {icon:"⌁",eyebrow:"PLV & QR",title:qrs.length+" affiches",detail:pending+" à configurer"+(configured?" · "+configured+" configurée"+(configured>1?"s":""):""),action:"Scanner une affiche PLV →",href:"/dashboard/plv?scan=1#qr-config"}
 ];
 return <><header className="dashHeader"><div><p className="dashEyebrow">BIENVENUE CHEZ BIKÉO</p><h1>Bonjour {store.name}.</h1><p>Voilà les outils Bikéo actifs aujourd'hui dans ton magasin.</p></div></header>
 <section style={{margin:"0 0 26px"}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
 {cards.map(x=><article className="statCard" key={x.eyebrow} style={{display:"flex",flexDirection:"column",minHeight:235,padding:24}}>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><small style={{letterSpacing:".11em",fontWeight:800,color:"#159b75"}}>{x.eyebrow}</small><span style={{fontSize:25}}>{x.icon}</span></div>
   <strong style={{fontSize:28,lineHeight:1.08,marginBottom:10}}>{x.title}</strong>
   <p style={{color:"#68706b",fontSize:14,lineHeight:1.45,margin:"0 0 22px"}}>{x.detail}</p>
   <Link href={x.href} style={{marginTop:"auto",fontWeight:800,color:"#171a19",textDecoration:"none",borderTop:"1px solid #e5e9e6",paddingTop:16}}>{x.action}</Link>
 </article>)}
 </div></section>
 <section className="dashColumns dashboardSingleAction"><div className="panel darkPanel"><small>CONSEILLER</small><h2>Un client est devant toi ?</h2><p>L'Advisor utilise ton catalogue et ton stock pour orienter le client vers le bon vélo.</p><a href="/conseiller">Conseiller un client →</a></div></section></>
}