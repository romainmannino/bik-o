import { getStoreStats } from "../../../lib/data";
export const dynamic="force-dynamic";
export default async function Stock(){
 const s=await getStoreStats(); const sync=s.lastSync?new Intl.DateTimeFormat("fr-FR",{dateStyle:"short",timeStyle:"short"}).format(new Date(s.lastSync)):"Jamais";
 return <><header className="dashHeader"><div><p className="dashEyebrow">STOCK MAGASIN</p><h1>Disponibilité</h1><p>Bikéo distingue le stock réel du magasin de la disponibilité fournisseur.</p></div></header>
 <div className="stockHero"><div><small>EN STOCK MAGASIN</small><strong>{s.inStock}</strong><span>unités disponibles immédiatement</span></div><div><small>DISPONIBLES SUR COMMANDE</small><strong>{s.orderable}</strong><span>références actuellement commandables</span></div><div><small>DERNIÈRE SYNCHRO</small><strong style={{fontSize:24}}>{sync}</strong><span>donnée inventory</span></div></div>
 <div className="panel"><small>PRINCIPE BIKÉO</small><h2>Une disponibilité compréhensible par le client.</h2><p className="bigText">Le client voit simplement <b>En stock magasin</b>, <b>Disponible sur commande</b> ou <b>Indisponible</b>. Ces états viennent maintenant de la base, plus de valeurs écrites en dur dans cette page.</p></div></>;
}
