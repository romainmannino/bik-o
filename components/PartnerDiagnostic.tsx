"use client";
import {useMemo,useState} from "react";

type Result={score:number;label:string;items:{name:string;state:"ok"|"warn"|"unknown";text:string}[]};

export default function PartnerDiagnostic(){
 const[name,setName]=useState(""),[address,setAddress]=useState(""),[website,setWebsite]=useState(""),[facebook,setFacebook]=useState(""),[instagram,setInstagram]=useState(""),[result,setResult]=useState<Result|null>(null);
 const complete=useMemo(()=>name.trim()&&address.trim(),[name,address]);
 function analyse(e:React.FormEvent){e.preventDefault();let score=35;const items:Result["items"]=[];
  if(website.trim()){score+=10;items.push({name:"Site web",state:"warn",text:"Site renseigné · qualité du catalogue et des fiches produits à analyser."})}else{score+=18;items.push({name:"Site web",state:"ok",text:"Aucun site renseigné · Bikéo peut créer immédiatement une présence web complète."})}
  if(facebook.trim()||instagram.trim()){score+=10;items.push({name:"Réseaux sociaux",state:"warn",text:"Compte social renseigné · fréquence et qualité éditoriale à confirmer."})}else{score+=17;items.push({name:"Réseaux sociaux",state:"ok",text:"Aucun réseau renseigné · fort levier potentiel pour les contenus Bikéo."})}
  items.push({name:"Fidélisation",state:"unknown",text:"Programme Wallet / CRM à confirmer lors de l'étude du magasin."});
  items.push({name:"PLV digitale",state:"unknown",text:"Usage de QR et fiches produit en magasin à confirmer."});
  score=Math.min(score,92);setResult({score,label:score>=75?"Fort potentiel Bikéo":score>=60?"Potentiel Bikéo à étudier":"Compatibilité à confirmer",items});
 }
 return <div className="partnerDiag">
  <div className="partnerDiagCopy"><small>CANDIDATURE PARTENAIRE</small><h2>Votre magasin est-il<br/>compatible avec Bikéo ?</h2><p>Bikéo ne cherche pas à équiper tous les magasins. Nous sélectionnons des indépendants pour lesquels notre plateforme peut créer un vrai levier digital.</p><div className="diagTrust"><span>01</span><b>Identification du magasin</b><span>02</span><b>Diagnostic digital</b><span>03</span><b>Étude de compatibilité Bikéo</b></div></div>
  <form className="partnerDiagForm" onSubmit={analyse}>
   {!result?<><div className="diagFormHead"><span>PRÉ-DIAGNOSTIC</span><b>Parlez-nous de votre magasin.</b><small>Les éléments non vérifiables resteront indiqués « à confirmer ».</small></div>
    <label>Nom du magasin<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Ex. Cycles Omega"/></label>
    <label>Adresse du magasin<input required value={address} onChange={e=>setAddress(e.target.value)} placeholder="Adresse, ville"/></label>
    <label>Site internet <em>optionnel</em><input type="url" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://..."/></label>
    <div className="diagTwo"><label>Facebook <em>optionnel</em><input value={facebook} onChange={e=>setFacebook(e.target.value)} placeholder="Page Facebook"/></label><label>Instagram <em>optionnel</em><input value={instagram} onChange={e=>setInstagram(e.target.value)} placeholder="@compte"/></label></div>
    <button disabled={!complete}>Évaluer mon potentiel Bikéo →</button><p className="diagFine">Ce pré-diagnostic ne prétend pas mesurer ce que Bikéo n'a pas encore vérifié. L'analyse automatisée Google Business et web sera ajoutée au moteur de candidature.</p>
   </>:<><button type="button" className="diagReset" onClick={()=>setResult(null)}>← Modifier</button><div className="diagScore"><span>COMPATIBILITÉ PRÉLIMINAIRE</span><strong>{result.score}<i>%</i></strong><b>{result.label}</b><p>{name} · {address}</p></div><div className="diagItems">{result.items.map(x=><div key={x.name} className={"diagItem "+x.state}><i>{x.state==="ok"?"✓":x.state==="warn"?"◐":"?"}</i><span><b>{x.name}</b><small>{x.text}</small></span></div>)}</div><div className="diagNext"><b>Étape suivante</b><p>Une candidature complète permettra de vérifier les données publiques du magasin et de déterminer précisément ce que Bikéo peut lui apporter.</p><button type="button">Candidater pour devenir partenaire →</button></div></>}
  </form>
 </div>
}