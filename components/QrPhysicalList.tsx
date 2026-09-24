"use client";
import {useEffect,useState} from "react";
import QRCode from "qrcode";
import {jsPDF} from "jspdf";

export default function QrPhysicalList({qrs,bikes,storeSlug}:{qrs:any[];bikes:any[];storeSlug:string}){
 const[origin,setOrigin]=useState("");const[open,setOpen]=useState<string|null>(null);const[images,setImages]=useState<Record<string,string>>({});
 useEffect(()=>setOrigin(window.location.origin),[]);
 const byId=new Map(bikes.map((b:any)=>[b.id,b]));
 async function qrData(q:any){const url=origin+"/q/"+q.code;if(images[q.id])return images[q.id];const data=await QRCode.toDataURL(url,{width:900,margin:3,errorCorrectionLevel:"H"});setImages(v=>({...v,[q.id]:data}));return data}
 async function toggle(q:any){if(open===q.id){setOpen(null);return}setOpen(q.id);await qrData(q)}
 async function png(q:any){const data=await qrData(q);const a=document.createElement("a");a.href=data;a.download="bikeo-"+q.qr_number+".png";a.click()}
 async function pdf(q:any){const data=await qrData(q);const doc=new jsPDF({unit:"mm",format:"a4"});doc.setFont("helvetica","bold");doc.setFontSize(18);doc.text("Bikéo · QR dynamique",20,24);doc.setFontSize(12);doc.text(q.qr_number,20,34);doc.addImage(data,"PNG",45,48,120,120);doc.setFont("helvetica","normal");doc.setFontSize(9);doc.text("Support physique Bikéo · "+(origin+"/q/"+q.code),20,184,{maxWidth:170});doc.save("bikeo-"+q.qr_number+".pdf")}
 return <>{qrs.map((q:any)=>{const bike:any=byId.get(q.product_id);const url=origin?origin+"/q/"+q.code:"";return <article className="qrPhysicalItem" key={q.id}><div className="qrPhysicalMain"><button type="button" className="qrCodeMock qrPreviewBtn" onClick={()=>toggle(q)} aria-label={"Afficher le QR "+q.qr_number}><span>QR</span><small>VOIR</small></button><div className="qrMeta"><small>NUMÉRO DU SUPPORT</small><strong>{q.qr_number}</strong><span>{bike?bike.brand+" · "+bike.name:"Non configuré"}</span></div><div className="qrRowActions"><button type="button" onClick={()=>toggle(q)}>Aperçu</button><button type="button" onClick={()=>png(q)}>PNG ↓</button><button type="button" onClick={()=>pdf(q)}>PDF ↓</button></div><div className="qrStats"><strong>{q.scan_count||0}</strong><small>scans</small>{bike&&<a href={"/magasin/"+storeSlug+"/velos/"+bike.slug} target="_blank">Voir la fiche ↗</a>}</div></div>{open===q.id&&<div className="qrPreviewPanel"><div className="qrPreviewImage">{images[q.id]?<img src={images[q.id]} alt={"QR "+q.qr_number}/>:<span>Génération…</span>}</div><div><small>QR DYNAMIQUE BIKÉO</small><h3>{q.qr_number}</h3><p>Ce QR reste identique. Tu peux changer le vélo associé sans réimprimer le support.</p>{url&&<a href={"/q/"+q.code} target="_blank" rel="noreferrer">Tester la destination ↗</a>}</div></div>}</article>})}</>
}