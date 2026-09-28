import PartnerDiagnostic from "../components/PartnerDiagnostic";
import {createClient} from "../lib/supabase/server";

const pillars = [
  ["01", "Votre site, déjà prêt", "Un site premium à votre identité, modifiable à tout moment, alimenté par les catalogues de vos marques lorsqu'elles partagent leurs données EPOS.", "Être visible sans devenir webmaster."],
  ["02", "PLV & QR dynamiques", "Une affiche reste en magasin, sa destination change en temps réel. Fiches vélo consultables, téléchargeables ou partageables avec le client.", "Transformer le magasin physique en point de contact digital."],
  ["03", "Réseaux sociaux", "Retrouvez les contenus de vos marques, créez facilement vos contenus magasin et préparez leur diffusion sur Facebook, Instagram et vos autres canaux.", "Être actif régulièrement sans y passer ses soirées."],
  ["04", "Fidélité & Wallet", "Points, tampons, Apple Wallet, Google Wallet, CRM, offres et notifications : tout ce qu'il faut pour faire revenir vos clients.", "Transformer une vente en relation durable."]
];

const differences = [
  ["Votre enseigne", "Vous gardez votre nom, votre image et votre identité commerciale."],
  ["Vos marques", "Vous restez libre de vos choix fournisseurs et de votre assortiment."],
  ["Vos décisions", "Pas de concept imposé : Bikéo équipe votre indépendance, il ne la remplace pas."],
  ["Des moyens mutualisés", "Technologie, données produits, contenus et outils marketing sont réunis dans une plateforme commune."]
];

export default async function Home() {
  const s=await createClient();
  const{data:branding}=await s.from("platform_settings").select("logo_rectangle_url").eq("id",1).maybeSingle();
  const logo=branding?.logo_rectangle_url;
  const Brand=()=> <div className="brand">{logo?<img className="platformLogo publicPlatformLogo" src={logo} alt="Bikéo"/>:<>bik<span>é</span>o</>}</div>;
  return (
    <main className="networkHome">
      <section className="hero networkHero">
        <nav><Brand/><div className="networkNav"><a href="#solution">La solution</a><a href="#independant">Le réseau</a><a className="networkLogin" href="/login">Espace partenaire</a></div></nav>
        <div className="heroCopy networkHeroCopy">
          <p className="eyebrow">LA CENTRALE DIGITALE DES MAGASINS VÉLO INDÉPENDANTS</p>
          <h1>La puissance digitale d'un réseau.<br/><em>La liberté d'un indépendant.</em></h1>
          <p className="lead">Bikéo donne aux magasins vélo indépendants une infrastructure digitale complète : site & catalogue, PLV intelligente, communication sociale et fidélité Wallet — sans changer d'enseigne, de marques ni de façon de travailler.</p>
          <div className="actions"><a href="#solution">Découvrir Bikéo</a><span>Une plateforme. Votre identité. Des moyens mutualisés.</span></div>
        </div>
        <div className="networkProof"><span>01<br/><b>VISIBLE</b></span><span>02<br/><b>COMMUNIQUER</b></span><span>03<br/><b>CONVERTIR</b></span><span>04<br/><b>FIDÉLISER</b></span></div>
      </section>

      <section className="networkStatement">
        <p>POURQUOI BIKÉO</p>
        <h2>Vous avez déjà le magasin.<br/>Nous lui donnons les moyens digitaux d'un réseau structuré.</h2>
        <p className="networkStatementLead">Bikéo ne vous demande pas de devenir une autre enseigne. Nous mutualisons ce qu'un indépendant a intérêt à ne pas reconstruire seul : technologie, catalogues produits, communication, PLV et fidélisation.</p>
      </section>

      <section id="solution" className="platform networkPlatform">
        <div className="sectionHead"><p>4 LEVIERS. UNE SEULE PLATEFORME.</p><h2>Du premier contact<br/>au prochain achat.</h2></div>
        <div className="networkPillars">{pillars.map(([n,t,d,b]) => <article key={n}><small>{n}</small><h3>{t}</h3><p>{d}</p><strong>{b}</strong></article>)}</div>
      </section>


      <section className="productShowcase realProof">
        <div className="showcaseHead"><p>VOIR BIKÉO EN ACTION</p><h2>Le vrai magasin.<br/>Le vrai produit.</h2><span>Les démonstrations ci-dessous utilisent le site Bikéo de Cycles Omega et les visuels réels de son magasin. Pas de faux catalogue : ce que vous voyez existe déjà dans Bikéo.</span></div>

        <div className="realScene">
          <div className="sceneCopy"><small>01 · SITE MAGASIN</small><h3>Une vraie vitrine digitale,<br/>à l'image du magasin.</h3><p>Identité, showroom, pratiques, marques et sélection de vélos. Le commerçant garde son enseigne : Bikéo fournit l'infrastructure.</p><a href="/magasin/cycles-omega" target="_blank">Ouvrir le vrai site Cycles Omega →</a></div>
          <div className="realPhotoFrame omegaShowroom"><div className="realLaptop"><div className="realScreenBar"><span>● ● ●</span><b>bik-o.vercel.app/magasin/cycles-omega</b></div><iframe src="/magasin/cycles-omega" title="Site réel Cycles Omega Bikéo"/></div><span className="realBadge">SITE RÉEL · BIKÉO</span></div>
        </div>

        <div className="realScene reverse">
          <div className="sceneCopy"><small>02 · CATALOGUE & FICHE PRODUIT</small><h3>Les vrais vélos.<br/>Les vraies fiches.</h3><p>Le catalogue reprend les données produit disponibles : visuels, modèles, prix et composants. Une fiche peut ensuite être ouverte depuis le web ou un QR en magasin.</p><a href="/magasin/cycles-omega/velos" target="_blank">Explorer le vrai catalogue →</a></div>
          <div className="realPhotoFrame omegaHero"><div className="realLaptop productLive"><div className="realScreenBar"><span>● ● ●</span><b>Catalogue Cycles Omega</b></div><iframe src="/magasin/cycles-omega/velos" title="Catalogue réel Cycles Omega"/></div><span className="realBadge">CATALOGUE RÉEL</span></div>
        </div>

        <div className="realScene">
          <div className="sceneCopy"><small>03 · PLV & QR DYNAMIQUE</small><h3>Du vélo physique<br/>à sa fiche digitale.</h3><p>Le client voit le vélo, scanne son accroche-guidon et retrouve immédiatement l'information sur son smartphone. Le QR physique reste en place même si le magasin change le vélo associé.</p></div>
          <div className="realPhotoFrame omegaShowroom homePlvScene">
            <img className="homeHangerArtwork" src="https://rzryxngvgmhlqbrstxrq.supabase.co/storage/v1/object/public/brand-assets/bikeo_accroche_guidon_transparente.png" alt="Accroche-guidon Bikéo avec QR code"/><div className="homeProductPhone"><iframe src="/magasin/cycles-omega/velos/oiz-m-pro-2027" title="Fiche produit réelle Bikéo"/></div>
            <span className="realBadge">AFFICHE PLV → FICHE PRODUIT</span>
          </div>
        </div>

        <div className="realScene reverse">
          <div className="sceneCopy"><small>04 · COMMUNICATION</small><h3>Le magasin a toujours<br/>quelque chose à raconter.</h3><p>Photos magasin, arrivages, livraisons clients et contenus des marques sont regroupés dans Bikéo pour alimenter une présence sociale régulière.</p></div>
          <div className="realPhotoFrame omegaFooter homeSocialScene">
            <div className="homeSocialCard">
              <header><span className="homeSocialAvatar">Ω</span><div><b>Cycles Omega</b><small>Grasse · À l’instant</small></div><strong>•••</strong></header>
              <div className="homeSocialPhoto"/>
              <div className="homeSocialBody"><b>Cycles Omega</b><p>Une nouveauté vient d’arriver au magasin 🚲<br/>Passez la découvrir chez Cycles Omega.</p><div><span>♡ J’aime</span><span>◯ Commenter</span><span>↗ Partager</span></div></div>
            </div>
            <span className="realBadge">CONTENU MAGASIN · PRÊT À PUBLIER</span>
          </div>
        </div>

        <div className="realScene">
          <div className="sceneCopy"><small>05 · FIDÉLITÉ WALLET</small><h3>Après la vente,<br/>le magasin reste présent.</h3><p>La carte de fidélité vit dans Apple Wallet ou Google Wallet. Points, avantages et notifications permettent au magasin de reprendre contact directement avec ses clients.</p></div>
          <div className="realPhotoFrame omegaHero walletRealScene walletCaptureScene"><div className="walletCapture"><div className="walletCaptureStatus">09:14 <span>● ◔ ▰</span></div><div className="walletCaptureNotification"><div className="walletCaptureLogo">Ω</div><div><b>Cycles Omega</b><p>Arrivage en magasin : Nouveau ORBEA OIZ<br/>2027 Taille M, venez vite le découvrir</p></div><small>maintenant</small></div><div className="walletCaptureCard"><div className="walletCaptureBrand">CYCLES<br/>OMEGA</div><div className="walletCaptureQr"><svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="white"/><g fill="#000"><path d="M5 5h28v28H5zm6 6v16h16V11zM67 5h28v28H67zm6 6v16h16V11zM5 67h28v28H5zm6 6v16h16V73z"/><path d="M40 5h7v7h-7zm14 0h7v14h-7zM40 19h14v7H40zm7 14h7v7h-7zm14 7h7v7h-7zM33 40h7v14h-7zm14 7h14v7H47zm21-7h7v14h-7zm14 0h7v7h-7zM40 61h7v7h-7zm14-7h7v14h-7zm14 7h14v7H68zm21-7h6v14h-6zM40 75h14v7H40zm7 14h7v6h-7zm14-14h7v20h-7zm14 0h7v7h-7zm7 14h13v6H82z"/></g></svg><small>MBR-82271155</small></div><div className="walletCaptureBottom"><span>Titulaire<br/><b>Martin PERRIER</b></span><span>Points<br/><b>0</b></span></div></div><div className="walletCaptureActions"><div>🛒<b>Faire des achats en ligne ou dans l'app</b></div><div>📞<b>Appeler</b></div></div></div><span className="realBadge">APPLE WALLET · NOTIFICATION CLIENT</span></div>
        </div>
      </section>

      <section className="partnerSection"><PartnerDiagnostic/></section>

      <section id="independant" className="networkIndependence">
        <div className="networkIndependenceIntro"><p>UN RÉSEAU D'INDÉPENDANTS</p><h2>Mutualiser les moyens.<br/><em>Pas les identités.</em></h2><p>Chaque partenaire Bikéo reste maître de son magasin. La force du réseau vient des outils, des données et des opportunités partagés — pas d'une uniformisation des enseignes.</p></div>
        <div className="networkDifference">{differences.map(([t,d],i)=><div key={t}><small>0{i+1}</small><h3>{t}</h3><p>{d}</p></div>)}</div>
      </section>

      <section className="networkFlow">
        <p>UN ÉCOSYSTÈME QUI SE RENFORCE</p>
        <h2>Magasins + marques + Bikéo.</h2>
        <div className="networkFlowGrid"><div><small>LES MARQUES</small><strong>Produits · EPOS · médias · contenus</strong></div><i>→</i><div className="networkFlowCenter"><small>BIKÉO</small><strong>Centralise, simplifie et distribue</strong></div><i>→</i><div><small>LES MAGASINS</small><strong>Vendent · communiquent · fidélisent</strong></div></div>
        <p className="networkFlowText">À mesure que le réseau grandit, Bikéo peut ouvrir de nouveaux services et avantages négociés pour ses partenaires, tout en préservant leur liberté commerciale.</p>
      </section>

      <section className="networkReturn">
        <div><p>UNE LOGIQUE DE RENTABILITÉ SIMPLE</p><h2>Quelques ventes additionnelles peuvent suffire à financer votre digital.</h2></div>
        <div className="networkReturnCard"><span>EXEMPLE À MESURER DANS VOTRE MAGASIN</span><strong>3</strong><b>ventes vélo additionnelles / an</b><p>Avec un vélo moyen à 5 000 € et 25 % de marge brute, trois ventes représentent 3 750 € de marge brute. Un ordre de grandeur qui permet de comparer simplement l'investissement Bikéo à sa valeur potentielle.</p></div>
      </section>

      <section className="promise networkPromise"><p>BIKÉO PARTENAIRE</p><h2>Restez indépendant.<br/>Ne restez plus seul face au digital.</h2><div><strong>Une solution pensée exclusivement pour le commerce vélo.</strong><span>Nous privilégions un réseau de partenaires engagés plutôt qu'un logiciel généraliste en libre-service. Configuration, outils métier et accompagnement sont pensés autour du quotidien du vélociste.</span></div><a className="networkCta" href="/login">Accéder à mon espace partenaire →</a></section>
      <footer><Brand/><p>La centrale digitale des magasins vélo indépendants.</p></footer>
    </main>
  );
}
