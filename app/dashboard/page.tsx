import { getDemoStore, getStoreStats } from "../../lib/data";
export const dynamic="force-dynamic";
export default async function Dashboard() {
 const [store,stats]=await Promise.all([getDemoStore(),getStoreStats()]);
 const cards=[["Vélos en catalogue",String(stats.products),"donnée catalogue"],["En stock",String(stats.inStock),"unités magasin"],["Disponibles sur commande",String(stats.orderable),"selon disponibilité"],["Site magasin",store.is_published?"Publié":"Brouillon","état réel"]];
 return <><header className="dashHeader"><div><p className="dashEyebrow">BIENVENUE CHEZ BIKÉO</p><h1>Bonjour {store.name}.</h1><p>Voilà ce qui se passe aujourd'hui dans ton magasin digital.</p></div><button className="primaryBtn">+ Ajouter un contenu</button></header>
 <section className="statGrid">{cards.map(([a,b,c])=><div className="statCard" key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></div>)}</section>
 <section className="dashColumns"><div className="panel"><div className="panelTitle"><div><small>DONNÉES RÉELLES</small><h2>Ton magasin aujourd'hui</h2></div></div>
 <div className="task"><i>1</i><div><strong>{stats.inStock} vélos disponibles immédiatement</strong><p>Calculé depuis la table inventory de ton magasin.</p></div><b>→</b></div>
 <div className="task"><i>2</i><div><strong>{stats.products} modèles actifs au catalogue</strong><p>Catalogue commun relié aux marques du magasin.</p></div><b>→</b></div>
 <div className="task"><i>3</i><div><strong>Site {store.is_published?"visible":"non publié"}</strong><p>{store.city??"Ville à compléter"} · identité issue de Supabase.</p></div><b>→</b></div></div>
 <div className="panel darkPanel"><small>CONSEILLER</small><h2>Un client est devant toi ?</h2><p>Le conseiller va utiliser le même catalogue et la même disponibilité que le site.</p><a href="/conseiller">Conseiller un client →</a></div></section></>;
}
