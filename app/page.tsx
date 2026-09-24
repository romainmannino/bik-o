import {createClient} from "../lib/supabase/server";
const pillars = [
  ["01", "Site & visibilité", "Une vitrine locale claire, structurée pour les clients comme pour les moteurs de recherche et assistants IA."],
  ["02", "Catalogue & stock", "Les marques, les vélos et la disponibilité magasin réunis dans une donnée commune."],
  ["03", "Conseiller un client", "Partir du besoin ou d’un vélo connu, puis proposer les alternatives pertinentes réellement vendues par le magasin."],
  ["04", "QRetail", "Le vélo physique devient un point de contact digital grâce aux QR dynamiques et aux fiches produit."],
  ["05", "BikeSocial", "Une photo ou une vidéo prise en magasin devient un contenu local prêt à publier."],
  ["06", "Clients & fidélité", "Leads, CRM et Wallet Apple / Google reliés au même profil client."]
];

export default async function Home() {const s=await createClient();const{data:branding}=await s.from("platform_settings").select("logo_rectangle_url").eq("id",1).maybeSingle();const logo=branding?.logo_rectangle_url;
  return (
    <main>
      <section className="hero">
        <nav><div className="brand">{logo?<img className="platformLogo publicPlatformLogo" src={logo} alt="Bikéo"/>:<>bik<span>é</span>o</>}</div><div className="pill">MVP · en construction</div></nav>
        <div className="heroCopy">
          <p className="eyebrow">LE SYSTÈME DIGITAL DU MAGASIN INDÉPENDANT</p>
          <h1>Le magasin reste indépendant.<br/><em>Son digital change d’échelle.</em></h1>
          <p className="lead">Bikéo réunit le site, le catalogue, le stock, le conseil client, la PLV digitale, les contenus et la fidélité dans une seule plateforme pensée pour le vélo.</p>
          <div className="actions"><a href="#platform">Découvrir la plateforme</a><span>Un socle. Plusieurs magasins. Une donnée commune.</span></div>
        </div>
      </section>
      <section id="platform" className="platform">
        <div className="sectionHead"><p>LE SOCLE BIKÉO</p><h2>Tout ce qui se passe entre<br/>le magasin et son client.</h2></div>
        <div className="grid">{pillars.map(([n,t,d]) => <article key={n}><small>{n}</small><h3>{t}</h3><p>{d}</p><div className="arrow">↗</div></article>)}</div>
      </section>
      <section className="promise"><p>NOTRE PRINCIPE</p><h2>Pas un ERP de plus.</h2><div><strong>Bikéo utilise la donnée existante.</strong><span>Le logiciel de caisse continue de gérer le magasin. Bikéo transforme cette donnée en expérience client, visibilité et opportunités commerciales.</span></div></section>
      <footer><div className="brand">{logo?<img className="platformLogo publicPlatformLogo" src={logo} alt="Bikéo"/>:<>bik<span>é</span>o</>}</div><p>Le digital du magasin de vélo indépendant.</p></footer>
    </main>
  );
}