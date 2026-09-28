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


      <section className="productShowcase">
        <div className="showcaseHead"><p>VOIR BIKÉO EN ACTION</p><h2>Pas une promesse.<br/>Des outils que vos clients voient.</h2><span>Chaque brique est pensée pour relier le magasin physique, sa présence digitale et ses clients.</span></div>
        <div className="showcaseScene sceneSite"><div className="sceneCopy"><small>01 · SITE & CATALOGUE</small><h3>Votre magasin.<br/>Ouvert aussi en ligne.</h3><p>Une vraie vitrine à votre identité, avec les marques que vous vendez, un catalogue vélo structuré et des fiches produit détaillées.</p><a href="/magasin/cycles-omega" target="_blank">Voir un magasin Bikéo →</a></div><div className="deviceDesk"><div className="browserBar"><i/><i/><i/><span>cycles-omega · Bikéo</span></div><div className="demoStore"><nav><b>CYCLES OMEGA</b><span>Vélos &nbsp; Marques &nbsp; Le magasin</span></nav><div className="demoStoreHero"><small>MAGASIN VÉLO · GRASSE</small><h4>Le vélo qui vous<br/>emmène plus loin.</h4><button>Découvrir les vélos</button></div><div className="demoBikeRow"><div>ORBEA<br/><b>Rise</b></div><div>ORBEA<br/><b>Wild</b></div><div>ORBEA<br/><b>Oiz</b></div></div></div></div>
        </div>
        <div className="showcaseScene sceneProduct"><div className="deviceDesk productDesk"><div className="browserBar"><i/><i/><i/><span>Fiche produit</span></div><div className="demoProduct"><div className="demoBikeArt">🚲</div><div><small>ORBEA · VTT ÉLECTRIQUE</small><h4>Rise LT</h4><b>5 999 €</b><p>Moteur · Batterie · Transmission · Tailles · Couleurs</p><button>Contacter le magasin</button></div></div></div><div className="sceneCopy"><small>02 · FICHE PRODUIT</small><h3>Le catalogue devient<br/>un vendeur digital.</h3><p>Photos, composants, prix et disponibilité réunis sur une fiche claire, consultable depuis le site comme depuis le magasin.</p></div></div>
        <div className="showcaseScene sceneQr"><div className="sceneCopy"><small>03 · PLV & QR DYNAMIQUE</small><h3>Le vélo en rayon<br/>continue sur le smartphone.</h3><p>Un accroche-guidon Bikéo, un QR qui reste le même et une destination que le magasin peut modifier sans réimprimer.</p></div><div className="qrStage"><div className="handleTag"><b>SCANNEZ<br/>CE VÉLO</b><div className="fakeQr">▦</div><small>Fiche complète · tailles · contact</small></div><div className="phoneMock"><div className="phoneIsland"/><div className="phoneBike">🚲</div><small>ORBEA</small><h4>Rise LT</h4><b>5 999 €</b><button>Je suis intéressé</button></div></div></div>
        <div className="showcaseScene sceneSocial"><div className="socialMock"><div className="socialTop"><b>f</b><span>Cycles Omega</span><i>•••</i></div><div className="socialPhoto">🚵</div><div className="socialLikes">♥ 124 &nbsp; 👍 38 &nbsp; 💬 12</div><p><b>Cycles Omega</b> Nouveau vélo, nouveau départ ! Découvrez notre dernier arrivage au magasin.</p><div className="floatingLike l1">👍</div><div className="floatingLike l2">♥</div><div className="floatingLike l3">👍</div></div><div className="sceneCopy"><small>04 · RÉSEAUX SOCIAUX</small><h3>Une présence active.<br/>Sans agence à gérer.</h3><p>Contenus de marques, photos du magasin, modèles de publications et planning : Bikéo transforme ce que vous avez déjà en communication régulière.</p></div></div>
        <div className="showcaseScene sceneWallet"><div className="sceneCopy"><small>05 · FIDÉLITÉ & WALLET</small><h3>Votre magasin reste<br/>dans la poche du client.</h3><p>Carte Apple ou Google Wallet, points, offres et notifications : la relation ne s'arrête plus au passage en caisse.</p></div><div className="walletStage"><div className="notificationMock"><b>Cycles Omega</b><span>Votre solde est maintenant de 69 points</span><small>maintenant</small></div><div className="phoneMock walletPhoneDemo"><div className="phoneIsland"/><div className="walletDemo"><small>CYCLES OMEGA</small><div className="walletVisual">🚵</div><div className="walletQr">▦</div><b>69 POINTS</b><span>Test Nom test</span></div></div></div></div>
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
