"use client";
import {useMemo,useState} from "react";

type Result={score:number;label:string;items:{name:string;level:0|1|2|3;status?:string}[]};

export default function PartnerDiagnostic(){
 const[name,setName]=useState(""),[address,setAddress]=useState(""),[website,setWebsite]=useState(""),[facebook,setFacebook]=useState(""),[instagram,setInstagram]=useState(""),[result,setResult]=useState<Result|null>(null),[analysing,setAnalysing]=useState(false),[step,setStep]=useState(0);
 const complete=useMemo(()=>name.trim()&&address.trim(),[name,address]);
 const stages=["Identification du magasin","Analyse du site web","Analyse des réseaux sociaux","Présence locale","Calcul de compatibilité"];
 function analyse(e:React.FormEvent){e.preventDefault();if(!complete||analysing)return;setAnalysing(true);setStep(0);
  let score=35;const items:Result["items"]=[];
  if(website.trim()){score+=10;items.push({name:"Présence web",level:2})}else{score+=18;items.push({name:"Présence web",level:1,status:"Levier Bikéo"})}
  if(facebook.trim()||instagram.trim()){score+=10;items.push({name:"Communication sociale",level:2})}else{score+=17;items.push({name:"Communication sociale",level:1,status:"Levier Bikéo"})}
  items.push({name:"Expérience digitale en magasin",level:0,status:"À confirmer"});
  items.push({name:"Fidélisation client",level:0,status:"À confirmer"});
  score=Math.min(score,92);
  let i=0;const timer=setInterval(()=>{i++;setStep(i);if(i>=stages.length){clearInterval(timer);setTimeout(()=>{setResult({score,label:score>=70?"Forte compatibilité":score>=40?"Compatible":"Potentiel important",items});setAnalysing(false)},350)}},430);
 }
 return <div className="partnerDiag">
  <div className="partnerDiagCopy"><small>CANDIDATURE PARTENAIRE</small><h2>Votre magasin est-il<br/>compatible avec Bikéo ?</h2><p>Bikéo ne cherche pas à équiper tous les magasins. Nous sélectionnons des indépendants pour lesquels notre plateforme peut créer un vrai levier digital.</p><div className="diagTrust"><span>01</span><b>Identification du magasin</b><span>02</span><b>Analyse digitale</b><span>03</span><b>Compatibilité Bikéo</b></div></div>
  <form className="partnerDiagForm" onSubmit={analyse}>
   {!result&&!analysing?<><div className="diagFormHead"><span>ANALYSE BIKÉO</span><b>Faites analyser votre magasin.</b><small>Quelques informations suffisent pour lancer le diagnostic.</small></div>
    <label>Nom du magasin<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Ex. Cycles Omega"/></label>
    <label>Adresse du magasin<input required value={address} onChange={e=>setAddress(e.target.value)} placeholder="Adresse, ville"/></label>
    <label>Site internet <em>optionnel</em><input type="url" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://..."/></label>
    <div className="diagTwo"><label>Facebook <em>optionnel</em><input value={facebook} onChange={e=>setFacebook(e.target.value)} placeholder="Page Facebook"/></label><label>Instagram <em>optionnel</em><input value={instagram} onChange={e=>setInstagram(e.target.value)} placeholder="@compte"/></label></div>
    <button disabled={!complete}>Analyser mon magasin →</button><p className="diagFine">Les éléments qui ne peuvent pas encore être vérifiés automatiquement resteront indiqués « à confirmer ».</p>
   </>:analysing?<div className="diagAnalyzing"><span>ANALYSE EN COURS</span><h3>Bikéo analyse votre présence digitale…</h3><div className="diagScan"><i style={{width:Math.min(100,(step/stages.length)*100)+"%"}}/></div><div className="diagStages">{stages.map((x,i)=><div key={x} className={i<step?"done":i===step?"active":""}><i>{i<step?"✓":"•"}</i><b>{x}</b></div>)}</div><small>Nous croisons uniquement les informations disponibles ou renseignées.</small></div>:result&&<><button type="button" className="diagReset" onClick={()=>setResult(null)}>← Modifier</button><div className="diagScore"><span>COMPATIBILITÉ BIKÉO</span><strong>{result.score}<i>%</i></strong><b>{result.label}</b><p>{name} · {address}</p></div><div className="diagScale"><span><i/>0–39%<b>Potentiel important</b></span><span><i/>40–69%<b>Compatible</b></span><span><i/>70–100%<b>Forte compatibilité</b></span></div><div className="diagSimpleItems">{result.items.map(x=><div key={x.name}><b>{x.name}</b><span className={"diagDots l"+x.level}><i/><i/><i/></span><small>{x.status||""}</small></div>)}</div><div className="diagNext"><b>Ce que Bikéo peut apporter</b><p>Votre magasin présente plusieurs leviers sur lesquels Bikéo peut compléter votre dispositif actuel.</p><button type="button">Candidater pour devenir partenaire →</button></div></>}
  </form>
 </div>
}