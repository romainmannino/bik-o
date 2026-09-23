import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bikéo — le digital du magasin de vélo indépendant",
  description: "Site, catalogue, stock, conseil client, contenus et fidélité réunis pour les magasins de vélo indépendants."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}