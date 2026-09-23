import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link href="/" className="sideLogo">bik<span>é</span>o</Link>

      <p className="sideLabel">MON MAGASIN</p>
      <nav className="sideNav">
        <Link href="/dashboard">⌂ <span>Vue d'ensemble</span></Link>
        <Link href="/dashboard/catalogue">▦ <span>Catalogue</span></Link>
        <Link href="/dashboard/stock">◇ <span>Stock & disponibilité</span></Link>
        <Link href="/dashboard/leads">◎ <span>Leads clients</span></Link>
      </nav>

      <p className="sideLabel">OUTILS CLIENT</p>
      <nav className="sideNav">
        <Link href="/conseiller">✦ <span>Conseiller un client</span></Link>
        <Link href="/magasin/demo">↗ <span>Voir mon site</span></Link>
      </nav>

      <div className="sideBottom">
        <div className="avatar">CO</div>
        <div><strong>Cycles Omega</strong><small>Magasin partenaire</small></div>
      </div>
    </aside>
  );
}
