const stats = [
  ["Vélos en catalogue","128","+12 ce mois"],
  ["En stock","43","12 modèles"],
  ["Leads clients","18","+6 cette semaine"],
  ["Visites site","1 284","+18%"]
];

export default function Dashboard() {
 return <>
   <header className="dashHeader"><div><p className="dashEyebrow">BIENVENUE CHEZ BIKÉO</p><h1>Bonjour Cycles Omega.</h1><p>Voilà ce qui se passe aujourd'hui dans ton magasin digital.</p></div><button className="primaryBtn">+ Ajouter un contenu</button></header>

   <section className="statGrid">{stats.map(([a,b,c])=><div className="statCard" key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></div>)}</section>

   <section className="dashColumns">
    <div className="panel">
      <div className="panelTitle"><div><small>À FAIRE</small><h2>Ton magasin aujourd'hui</h2></div><span>23 sept.</span></div>
      <div className="task"><i>1</i><div><strong>3 nouveaux leads à rappeler</strong><p>Deux demandes d'essai et une question produit.</p></div><b>→</b></div>
      <div className="task"><i>2</i><div><strong>7 vélos sans photo magasin</strong><p>Ajoute une photo réelle pour enrichir leur fiche.</p></div><b>→</b></div>
      <div className="task"><i>3</i><div><strong>Une publication à valider</strong><p>BikeSocial a préparé un post à partir de ton arrivée Wild.</p></div><b>→</b></div>
    </div>
    <div className="panel darkPanel"><small>CONSEILLER</small><h2>Un client est devant toi ?</h2><p>6 questions pour identifier son besoin et trouver les vélos adaptés parmi les marques et le stock du magasin.</p><a href="/conseiller">Conseiller un client →</a></div>
   </section>
 </>;
}
