export default function Stock(){
 return <><header className="dashHeader"><div><p className="dashEyebrow">STOCK MAGASIN</p><h1>Disponibilité</h1><p>Bikéo distingue le stock réel du magasin de la disponibilité fournisseur.</p></div></header>
 <div className="stockHero"><div><small>EN STOCK MAGASIN</small><strong>43</strong><span>vélos disponibles immédiatement</span></div><div><small>DISPONIBLES SUR COMMANDE</small><strong>85</strong><span>depuis les catalogues marques</span></div><div><small>DERNIÈRE SYNCHRO</small><strong>14:32</strong><span>Source : logiciel magasin</span></div></div>
 <div className="panel"><small>PRINCIPE BIKÉO</small><h2>Une disponibilité compréhensible par le client.</h2><p className="bigText">Le client ne voit pas tes données internes. Il voit simplement <b>En stock magasin</b>, <b>Disponible sur commande</b> ou <b>Indisponible</b>. La donnée reste synchronisée avec tes outils existants.</p></div></>;
}
