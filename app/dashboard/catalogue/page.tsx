const bikes=[
 ["Orbea","Wild M20","VTT électrique","DJI Avinox","7 999 €","En stock"],
 ["Orbea","Rise LT M10","VTT électrique","Shimano EP801","8 499 €","En stock"],
 ["Orbea","Oiz M30","VTT XC","—","3 999 €","Sur commande"],
 ["Orbea","Orca M30","Route","—","2 999 €","En stock"],
 ["Orbea","Terra M30TEAM","Gravel","—","3 299 €","Sur commande"]
];
export default function Catalogue(){
 return <><header className="dashHeader"><div><p className="dashEyebrow">CATALOGUE COMMUN</p><h1>Mes vélos</h1><p>La donnée produit marque reliée à la disponibilité de ton magasin.</p></div><button className="primaryBtn">Importer un catalogue</button></header>
 <div className="toolbar"><input placeholder="Rechercher un vélo, EAN, moteur..."/><button>Toutes les marques</button><button>Toutes les catégories</button></div>
 <div className="table"><div className="tr th"><span>MARQUE / MODÈLE</span><span>CATÉGORIE</span><span>MOTORISATION</span><span>PRIX</span><span>DISPONIBILITÉ</span></div>{bikes.map(b=><div className="tr" key={b[1]}><span><small>{b[0]}</small><strong>{b[1]}</strong></span><span>{b[2]}</span><span>{b[3]}</span><span>{b[4]}</span><span><em className={b[5]=="En stock"?"ok":"wait"}>{b[5]}</em></span></div>)}</div></>;
}
