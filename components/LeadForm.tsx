"use client";
import { useState } from "react";
import { createClient } from "../lib/supabase/client";
export default function LeadForm({productId,productName}:{productId?:string;productName?:string}){
 const [state,setState]=useState<"idle"|"sending"|"ok"|"error">("idle");
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setState("sending");const f=new FormData(e.currentTarget);if(f.get("company")){setState("ok");return}
 const supabase=createClient();const {error}=await supabase.rpc("submit_public_lead",{p_store_slug:"cycles-omega",p_product_id:productId??null,p_first_name:f.get("first_name")||null,p_last_name:f.get("last_name")||null,p_email:f.get("email")||null,p_phone:f.get("phone")||null,p_message:f.get("message")||null,p_source:productId?"product":"website"});
 setState(error?"error":"ok");if(!error)e.currentTarget.reset();}
 if(state==="ok")return <div className="panel"><h3>Demande envoyée ✓</h3><p>Le magasin a bien reçu ta demande.</p></div>;
 return <form className="panel" onSubmit={submit}><small>CONTACT / ESSAI</small><h2>{productName ? "Essayer "+productName : "Une question ?"}</h2><div className="toolbar"><input name="first_name" placeholder="Prénom"/><input name="last_name" placeholder="Nom"/></div><div className="toolbar"><input name="email" type="email" placeholder="Email"/><input name="phone" placeholder="Téléphone"/></div><input name="company" tabIndex={-1} autoComplete="off" style={{display:"none"}}/><textarea name="message" placeholder="Votre demande" style={{width:"100%",minHeight:100,margin:"12px 0"}}/><button className="primaryBtn" disabled={state==="sending"}>{state==="sending"?"Envoi...":"Envoyer ma demande"}</button>{state==="error"&&<p>Impossible d'envoyer pour le moment. Renseigne un email ou un téléphone.</p>}</form>
}