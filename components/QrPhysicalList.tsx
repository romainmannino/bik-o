"use client";
import {useEffect,useState} from "react";
import QRCode from "qrcode";

export default function QrPhysicalList({qrs,bikes,storeSlug}:{qrs:any[];bikes:any[];storeSlug:string}){
 const[origin,setOrigin]=useState("");const[open,setOpen]=useState<string|null>(null);const[images,setImages]=useState<Record<string,string>>({});
 useEffect(()=>setOrigin(window.location.origin),[]);
 const byId=new Map(bikes.map((b:any)=>[b.id,b]));
 async function qrData(q:any){const url=origin+"/q/"+q.code;if(images[q.id])return images[q.id];const data=await QRCode.toDataURL(url,{width:900,margin:3,errorCorrectionLevel:"H"});setImages(v=>({...v,[q.id]:data}));return data}
 async function toggle(q:any){if(open===q.id){setOpen(null);return}setOpen(q.id);await qrData(q)}

 return <>{qrs.map((q:any)=>{const bike:any=byId.get(q.product_id);const url=origin?origin+"/q/"+q.code:"";return <article className="qrPhysicalItem" key={q.id}><div className="qrPhysicalMain"><button type="button" className="qrCodeMock qrPreviewBtn" onClick={()=>toggle(q)} aria-label={"Afficher la PLV "+q.qr_number}><span>PLV</span><small>VOIR</small></button><div className="qrMeta"><small>NUMÉRO DE LA PLV</small><strong>{q.qr_number}</strong><span>{bike?bike.brand+" · "+bike.name:"Non configuré"}</span></div><div className="qrRowActions"><button type="button" onClick={()=>toggle(q)}>Aperçu</button></div><div className="qrStats"><strong>{q.scan_count||0}</strong><small>scans</small>{bike&&<a href={"/magasin/"+storeSlug+"/velos/"+bike.slug} target="_blank">Voir la fiche ↗</a>}</div></div>{open===q.id&&<div className="qrPreviewPanel"><div className="qrPreviewImage">{images[q.id]?<img src={images[q.id]} alt={"QR "+q.qr_number}/>:<span>Génération…</span>}</div><div><small>PLV CONNECTÉE BIKÉO</small><h3>{q.qr_number}</h3><p>Cette PLV reste la même. Tu peux changer le vélo associé à tout moment sans changer le support.</p>{url&&<a href={"/q/"+q.code} target="_blank" rel="noreferrer">Tester la destination ↗</a>}</div></div>}</article>})}</>
}