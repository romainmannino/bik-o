"use client";
import {useMemo,useRef,useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "../lib/supabase/client";


export default function QrConfigurator({qrs,bikes}:{qrs:any[];bikes:any[]}){
 const s=createClient(),router=useRouter();
 const[qr,setQr]=useState(""),[brand,setBrand]=useState(""),[product,setProduct]=useState(""),[search,setSearch]=useState(""),[scanning,setScanning]=useState(false),[scanHint,setScanHint]=useState(""),[origin,setOrigin]=useState("");
 const readerId="bikeo-live-reader"; const scannerRef=useRef<any>(null); const handledRef=useRef(false); const autoScanRef=useRef(false);
 useEffect(()=>{setOrigin(window.location.origin);return()=>{const scanner=scannerRef.current;if(scanner?.isScanning)Promise.resolve(scanner.stop()).catch(()=>{});scannerRef.current=null}},[]);
 const brands=useMemo(()=>Array.from(new Set(bikes.map(b=>b.brand))).sort() as string[],[bikes]);
 const filtered=useMemo(()=>{const list=brand?bikes.filter(b=>b.brand===brand):[];const q=search.trim().toLowerCase();return q?list.filter(b=>(b.name+" "+(b.year||"")).toLowerCase().includes(q)).slice(0,12):[]},[bikes,brand,search]);
 const target=qrs.find(x=>x.qr_number.toLowerCase()===qr.trim().toLowerCase());
 const selected=bikes.find(b=>b.id===product);
 async function save(){if(!target){alert("Ce numéro de QR n'appartient pas à ton magasin.");return}if(!product){alert("Choisis un vélo.");return}const{error}=await s.from("store_qr_codes").update({product_id:product,updated_at:new Date().toISOString()}).eq("id",target.id);if(error)alert(error.message);else{setQr("");setBrand("");setProduct("");setSearch("");router.refresh()}}
 async function scan(){
  if(scanning){const old=scannerRef.current;try{if(old?.isScanning)await old.stop()}catch{}scannerRef.current=null;handledRef.current=false;setScanning(false);setScanHint("");return}
  try{
   setScanning(true);handledRef.current=false;setScanHint("Initialisation de la caméra…");
   await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
   const {Html5Qrcode}=await import("html5-qrcode");
   const scanner=new Html5Qrcode(readerId,{verbose:false});scannerRef.current=scanner;
   const onDecoded=async(raw:string)=>{
    if(handledRef.current)return;
    let match=qrs.find((x:any)=>raw.includes(x.code)||raw.toLowerCase().includes(String(x.qr_number).toLowerCase()));
    if(!match){try{const u=new URL(raw,window.location.origin);const parts=u.pathname.split("/").filter(Boolean);const token=u.searchParams.get("id")||u.searchParams.get("token")||parts[parts.length-1]||"";match=qrs.find((x:any)=>token===x.code||token.toLowerCase()===String(x.qr_number).toLowerCase())}catch{}}
    if(!match){setScanHint("QR détecté mais non reconnu par Bikéo.");return}
    handledRef.current=true;setScanHint("QR reconnu…");try{if(scanner.isScanning)await scanner.stop()}catch{}scannerRef.current=null;setQr(match.qr_number);setScanning(false);setScanHint("");
   };
   const config={fps:15,disableFlip:true};
   try{await scanner.start({facingMode:"environment"},config,onDecoded,()=>{})}
   catch(firstError){console.warn("BIKEO_CAMERA_ENVIRONMENT",firstError);const cameras=await Html5Qrcode.getCameras();if(!cameras?.length)throw firstError;const rear=cameras.find((c:any)=>/back|rear|environment|arrière|dos/i.test(c.label))||cameras[cameras.length-1];await scanner.start(rear.id,config,onDecoded,()=>{})}
   setScanHint("Place le QR dans le cadre. La détection est automatique.");
  }catch(e:any){console.error("BIKEO_CAMERA",e);scannerRef.current=null;setScanning(false);const detail=e?.message||e?.name||String(e);setScanHint("");alert("Scanner impossible : "+detail)}
 }
 useEffect(()=>{if(autoScanRef.current)return;const params=new URLSearchParams(window.location.search);if(params.get("scan")==="1"){autoScanRef.current=true;document.getElementById("qr-config")?.scrollIntoView({behavior:"smooth",block:"start"});setScanHint("Appuie sur « Scanner le QR » pour ouvrir la caméra.");}},[]);
 const scanUrl=target&&origin?origin+"/q/"+target.code:"";
 return <section id="qr-config" className="panel merchantQrConfig"><div><small>CONFIGURER UNE ACCROCHE</small><h2>Scanner ou saisir le QR</h2><p>Scanne le support ou saisis son numéro, puis recherche directement le modèle à associer.</p>{scanUrl&&<div className="qrTestCard"><img src={"https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="+encodeURIComponent(scanUrl)} alt={"QR "+target.qr_number}/><div><strong>{target.qr_number}</strong><span>QR de test</span><a href={scanUrl} target="_blank" rel="noreferrer">Tester le lien ↗</a></div></div>}</div><div className="qrConfigForm"><div className="qrNumberLine"><input value={qr} onChange={e=>setQr(e.target.value)} placeholder="N° QR exact · ex. 94D37-0001"/><button type="button" onClick={scan}>{scanning?"Fermer le scanner":"Scanner le QR"}</button></div>{scanning&&<div className="qrScannerWrap"><div id={readerId}/>{scanHint&&<p className="qrScanHint staticHint">{scanHint}</p>}</div>}<select value={brand} onChange={e=>{setBrand(e.target.value);setProduct("");setSearch("")}}><option value="">1. Sélectionner la marque</option>{brands.map(b=><option key={b} value={b}>{b}</option>)}</select><div className="bikeSearchBox"><input value={search} disabled={!brand} onChange={e=>{setSearch(e.target.value);setProduct("")}} placeholder={brand?"2. Tape le nom du modèle · ex. Wild, Rise, Orca…":"2. Sélectionne d'abord la marque"}/>{brand&&search&&<div className="bikeSearchResults">{filtered.length?filtered.map(b=><button type="button" key={b.id} className={product===b.id?"selected":""} onClick={()=>{setProduct(b.id);setSearch(b.name+(b.year?" · "+b.year:""))}}><strong>{b.name}</strong>{b.year&&<span>{b.year}</span>}</button>):<span className="noBikeResult">Aucun modèle trouvé</span>}</div>}</div>{selected&&<div className="selectedBike">✓ {selected.brand} · <strong>{selected.name}</strong>{selected.year?" · "+selected.year:""}</div>}<button className="primaryBtn" type="button" onClick={save}>Associer ce QR au vélo</button></div></section>
}