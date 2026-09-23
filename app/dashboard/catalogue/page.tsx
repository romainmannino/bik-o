import { getCatalog } from "../../../lib/data";
export const dynamic="force-dynamic";
const euro=(c:number|null)=>c==null?"—":new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(c/100);
export default async function Catalogue(){
 const bikes:any[]=await getCatalog();
 return <><header className="dashHeader"><div><p className="dashEyebrow">CATALOGUE COMMUN</p><h1>Mes vélos</h1><p>La donnée produit marque reliée à la disponibilité réelle du magasin.</p></div><button className="primaryBtn">Importer un catalogue</button></header>
 <div className="toolbar"><input placeholder="Rechercher un vélo, EAN, moteur..."/><button>Toutes les marques</button><button>Toutes les catégories</button></div>
 <div className="table"><div className="tr th"><span>MARQUE / MODÈLE</span><span>CATÉGORIE</span><span>MOTORISATION</span><span>PRIX</span><span>DISPONIBILITÉ</span></div>{bikes.map((b:any)=>{const inv=(b.product_variants??[]).flatMap((v:any)=>v.inventory??[]);const stock=inv.some((i:any)=>i.public_status==="in_stock"&&i.quantity>0);const orderable=inv.some((i:any)=>i.public_status==="orderable");const label=stock?"En stock":orderable?"Sur commande":"Indisponible";return <div className="tr" key={b.id}><span><small>{b.brands?.name??"—"}</small><strong>{b.name}</strong></span><span>{b.category??"—"}</span><span>{b.motor_system??"—"}</span><span>{euro(b.msrp_cents)}</span><span><em className={stock?"ok":"wait"}>{label}</em></span></div>})}</div></>;
}
