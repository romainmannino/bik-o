"use client";
import {useEffect,useState} from "react";

const tabs=[
  ["overview","Vue d’ensemble"],["card","Ma carte"],["program","Programme fidélité"],
  ["customers","CRM clients"],["scan","Scanner"],["notifications","Notifications"],["share","Partager"]
] as const;

export default function LoyaltyWorkspace(){
 const[tab,setTab]=useState<(typeof tabs)[number][0]>("overview");const[integration,setIntegration]=useState<{status?:string;external_slug?:string}|null>(null);useEffect(()=>{fetch("/api/loyalty/status",{cache:"no-store"}).then(r=>r.json()).then(x=>setIntegration(x.integration??null)).catch(()=>setIntegration(null))},[]);
 return <div className="loyaltyWorkspace">
  <header className="dashHeader"><div><p className="dashEyebrow">FIDÉLITÉ BIKÉO · MOTEUR DIGIFYD</p><h1>Fidélité & Wallet</h1><p>Carte Apple Wallet et Google Wallet, programme fidélité, clients et communication depuis Bikéo.</p></div><span className={"loyaltyStatus "+(integration?.status==="active"||integration?.status==="provisioned"?"connected":"")}>{integration?.status==="active"||integration?.status==="provisioned"?"Moteur Digifyd provisionné":"Connexion Digifyd à finaliser"}</span></header>
  <nav className="loyaltyTabs">{tabs.map(([id,label])=><button key={id} className={tab===id?"on":""} onClick={()=>setTab(id)}>{label}</button>)}</nav>
  {tab==="overview"&&<section className="loyaltyOverview"><div className="statGrid"><div className="statCard"><span>Clients fidélité</span><strong>—</strong><small>CRM Digifyd</small></div><div className="statCard"><span>Cartes Wallet</span><strong>—</strong><small>Apple + Google</small></div><div className="statCard"><span>Récompenses</span><strong>—</strong><small>disponibles</small></div><div className="statCard"><span>Notifications</span><strong>—</strong><small>campagnes envoyées</small></div></div><div className="loyaltyGrid"><Feature title="Ma carte" text="Personnalise le logo, la bannière, les couleurs et les informations visibles dans Wallet." action={()=>setTab("card")}/><Feature title="Programme fidélité" text="Configure points, tampons, seuils, récompenses et règles d’attribution." action={()=>setTab("program")}/><Feature title="CRM clients" text="Retrouve les membres, leur Wallet, leur progression et leur dernière visite." action={()=>setTab("customers")}/><Feature title="Notifications Wallet" text="Prépare des campagnes et communique directement sur les cartes installées." action={()=>setTab("notifications")}/></div></section>}
  {tab==="card"&&<Panel eyebrow="PERSONNALISATION WALLET" title="Ma carte" text="Logo, bannière, nom de la carte, couleurs, téléphone, adresse, boutons et champs complémentaires : on réutilise ici le studio Digifyd existant."/ >}
  {tab==="program"&&<Panel eyebrow="PROGRAMME" title="Programme fidélité" text="Tampons ou points, seuil, récompense, type d’avantage, déclenchement et report du surplus seront pilotés par le moteur Digifyd."/ >}
  {tab==="customers"&&<Panel eyebrow="CRM" title="Clients fidélité" text="Liste clients, coordonnées, numéro membre, progression, récompenses, type de Wallet et dernière visite seront synchronisés depuis Digifyd."/ >}
  {tab==="scan"&&<Panel eyebrow="PASSAGE EN MAGASIN" title="Scanner une carte" text="Scan du QR Wallet ou recherche client, puis ajout ou retrait de fidélité avec mise à jour immédiate du pass."/ >}
  {tab==="notifications"&&<Panel eyebrow="COMMUNICATION WALLET" title="Notifications" text="Création des campagnes, audience, message, image, historique et envoi aux Apple Wallet compatibles via le moteur Digifyd."/ >}
  {tab==="share"&&<Panel eyebrow="ACQUISITION" title="Partager la carte" text="QR code et lien d’inscription du magasin pour créer ou récupérer une carte puis l’ajouter à Apple Wallet ou Google Wallet."/ >}
 </div>
}
function Feature({title,text,action}:{title:string;text:string;action:()=>void}){return <article><small>DIGIFYD</small><h3>{title}</h3><p>{text}</p><button onClick={action}>Ouvrir →</button></article>}
function Panel({eyebrow,title,text}:{eyebrow:string;title:string;text:string}){return <section className="loyaltyPanel"><small>{eyebrow}</small><h2>{title}</h2><p>{text}</p><div className="loyaltyBridgeNote"><strong>Interface Bikéo prête.</strong><span>Prochaine étape : brancher ce module aux données et actions réelles de Digifyd sans dupliquer le moteur Wallet.</span></div></section>}
