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
            <img className="homeHangerArtwork" src="data:image/webp;base64,UklGRhAdAABXRUJQVlA4WAoAAAAQAAAAYwAA9wAAQUxQSFgCAAABoERtmyHJ+uKPf2zbtnVtb23btr3y3dm2bdu2bcUf8V3fjMyo3SAiJoALR0/RQghmMZUqxRD5H2OwVJ4USPLn1+696qyzrr33zR9IMqSyJCPT48esOljwjzpg5SMeMTKkghj5wYnT8Hfxql7w9yknfUlaKZLxu6N7AFAvDv/onFcHDDr2O1oqQiQvHw2o4H+LAiOvJmMBjD9vDahDpU6BnX5lbJzx02WggsrFY8GHtIYZPxyPNsjaBuM/ZGxU5EfjocisGP8RY4OS/TgHiuyKub9Zao5xE7RBDdtgC1pjjJehDWqpuIKWJWT8PXw9wEk9RPp+HVOOvPtDUVPFgQw5zq3+nKuu6eBcXZzr9klKGVBIxeEMGTSjF1cjcUN/Sak6lFJwJ6146nZnKJ5gRkrFc+j8GVPp4PAIrXiKSxhawJkt4bCWcEhLOKUlnNcCBHfQigd9m7F0gjG/M5VO3YY0ls7jfIbqfEbVOjl0/oypOhRSsSGN1a9T/drrbis1Evd4lrzrQOuiWIfGjJbxN3vGe1cP5/0zKebIatwDWg/FPjQ2NNlP4+Dr4DHlF0tNYeTzXZzkE9f5RUY213iTiOQSketpbHLgFQKfx8NdwcBmB17RDppD0fFKBjY98MGREKlKBGOfZGDzjV9uDXhfhffA1l8xsIRG3jwfgIr7L04UwPxbSWMZk5FXLu8AiKp6r6oCAMtfSVpiMY3kMwfP6Yj/2HHOwU+QNBbVEsn3bzl51y3WXHOLXU++5X2SyVjcGPg/Q2SZo4UQzEIIFrnE/0v8v8T/S/y/yE9WUDggkhoAAPBbAJ0BKmQA+AA+USSNRKOiIRR7HlA4BQSygGokXu5gSd6FlvwItvJ5j/1V9Zz0Tf5/1AP61/o+sZ9AD9VfTg9kH9xP239oz/7dYBwuH+M7ZP7P+PnnX4qvG/sL/bv/P/n/h5/lPGN1F5m/yv7Vfcv7x+0X9y/dL5Y/1X5Ved/wr/xfUC/Gf5R/ZPyd/uf7je5D/Vd1Do/+O/3X5d/AL6rfOf8J/e/25/uHp7/z35Fe7P2B/wv5Vf2D7AP5T/Pf81/b/3F/vv//+uf8f/kfGu+6f6n/k+4D/L/6H/n/8L+2/+V///2v/0H++/yv+P/6f+J9r/5t/hf+F/mP8x/1v87/9PwF/kv9B/0P93/yn/Y/yv///8v3j+0P9ufZd/ZL/wCzgGBYiKb9x3i+z/oi7M3uj0XAwglp5VwydhEe6w9M6+bFgw6h2aMF7rw3w61l0jMABeIkcmcxHM+nKbEz7nyMh/H3TJ6CxQa4yePfWlX58Jnn/sZrENrFcfWS70SXdo74/yhFpC8pRkGqvqwNI+1k+pdFfR+sFSnlB41JN3IXUPo3+I1/XyP+PqcooDcj/RacP7N3bXPHAk2rI0UEHk36xzbDyGGNgHjDczAZh0FTGhNdPbAn14FI3pt9cXywvLuZngsjpwM75QlpCv6MZ/z30cvIo6vrYTv8u98ANDv9IvSPuNaNmFwGG9TObMdTmSUgwcn2HjRJ+liVe7JIUz+DOP1Px7LuS8VZIBSGT30peAFY5tacBdT4cnK0PEnTUrF0+zpSL1YXkIBGD5suGKypzo4K5kX0eel9sgB3+8DOKIkS7u+LJyAXvyFYItLP78BKavfVWhBqpxWbj3hxkIA4WMZxVsJAWcRk1VDmvHaa64nRBPVSD8G2Ah9Ml7miAI+wQDrVFDJPXjZRX6LkjZ/K8BWJpFGCyZDanAZ5qxXDYSr2gwmAqLWgc1bL8CqCcTvoQ4xIKYmYqPbvKTjIC/e6YkraU/7UgADNg8f0IAFt8Qa3h1ssAfLntTaercMqBRnMILk/Fd52h/8nQZ35aDhCE3P8DdR9+KgB5r56NOdw51wOAnkXretlolihndjfk/LBmVCGqiZ0WTttcyClmB81zkV9hADsZUQ+VfltN61dw3GmsicqJWTUiBTkgOi1XCMCe4+lJ7PqSl6zWtFDr5OmYxM/gSoKlSaKHSu94GJijO3RkgLRbz26WE/P7uuljEzjqt1pJztE231uku70wMQ7bcL4grBuPQVjjjXaPAA5uxtEaRSf27ZSvYOBYTuM51gFjPoDjUM2d5IKmf+M+gTioM2KKelkfHvmqmHc+Ob1nN/L33sqhtDT1TVG+WNaKSAKj5oVOk5SOjvO4cWgjM/FlV2M9sNG+a/qM7vL5j9jKYEM8d3BdywFQfX+anKlibbVswPZ1cptZomyujcjXtniso/ZRmVFbYF0dGYIb13ZzPqEBJ0KgAmqvnSvvv6w4R8usYdFfZ6BpNgghC3KkAkeihj16Gj9v51uurCBB/UWDRfQoKrzIxF3j50WxkQb/ew0Kp6iw4p4XGXgAzWnrlYZcpsNHDIiZ+/pEvIG13WgZSx4S/jCgLGDggdY+jUOk2iwI9CIDSyhp8ta6OixYbq06QolZR01bIHpvlU4YGEoE1NEFzIvdToA8w8voxBEkdZk93YbXQwN6fQqmcyt6SYGWQ4hUaTTDN74RUk6KZrNV/okeYXAQB/zVsn+oq7NuOa3gDdAsCsGJHLhzXZmZ/Y3AP8yrAhf4Uq5eheBz1C8rIXkdhQGDrMmwxioGsQ4oEuE82ktNESKVDnukg5hW7tPmyny1NbzkCQVyJ4y2kKHA5DFb4v0L0vdJu7oDchxUsw1s0bAURjRMGLwYq7foEqftwZd9v1Ev1mGR1yfgn3n9RDHD/uOd1ARFf6DEUYmL2fcPUG63hcMl3s3urtWlUeZ7NOYpDFIh8PajxE14lK1dE4ldP9zhFFx6ysZAoff0xgK0653gqlpNtDMrdGoWltpSXMYJ0mBnWXR5w2cR4FLBS2HDZMpBwi5lEeFXGy2RC/jReAMLC98xuJhRI4gtbHOfk6itSvL68dy1dfDFUMzwAmQKG5KVqCmdR3DujH7kWRpDCEPq1zn1y7b+h01t/gglWGtDG84hPX6WX8PckRum5lf4HHJHxw27hgc8Yslkoe2yJ6RgJg4c0BS8Sc9wg6LCuYEVWtywo0Rqq0zEPTLbmOJwT4ZxZsBU63J4nXIvvl/NMC5bLSrV5nFWK6qskmkRjKmni0Vcc+g2WthBDWdUQbIxqy9FxIXQS5zlHJaTVzFqgm00go1KQ5bZVqZNxxsvqrAGtJujHR86evoB+V2bkbxvsKXKjD4hFUfpJtirYj+mvb4Y8ZrfHAbjavy1YPPfE5RZL2luqxn+ZhbL9ZCOshLOxreuQx8F3WyxoF0QWS5BdVtkt/ZWgLeTdRdrrR43Y9istHb35xfsB+SdgsXFmICAPk7iBNd/MC9Qbs4s9vW4bkOxUMYBJLF3bMACcGT1RY/hK0CYTMubUgCKwdmwFvUmfzjLdtWn84Ofr4044qPvmQ6RvxPk6E6uqokG8XGbtR21anxu5RZYVuSAvaNwyQ/FeRG2Ae7ySZl8cGjK0gTY3/9qdW1SMK/QIWcWjW++xgZ4S+xForen0fcliFLGYIUwOAfwbVKZqwO+alugfFk3hZAG/kE765seVC9xjjC7hq9ns7ogtgyC5Lsz1ux866yDx73OxyFr2dJedOtakdj0S4CixGla8WrnRileF5AC5rDDVUeaU3B9EigjRYxT4joTuOqfBGlr/uNVLO3d2oQglqQJHR/+YOQfK4IEw7E/rDpEp1uTCqPPkmje0VWYJxN8NYKYup8SYNTcCZ4dzv/vBDhHW//pAPcb/Wef/JenSVefyjiTg0G/KuiofN4LrTlgm0dH2DYcKI25/L6BiAKU8QCnQWUfSrJrSmA/l/Jnf1zzQlHrcDzaXrsbasr50epgtzmGqgGwm2umNz1D4krLKY4OWcTfqUWABsjpkkF/lM03niHxC5s9CiKdPO/zUCpPAYIrkkkj12VDIDQ8hJVctR09wyy6ROtInaWGx5Kh6RHJotk3h2Q5QFp+0Dfz+9snzXEz8pyMt5dYAXCLQDhxr7CYMT/nZ9UwmMe/9N2l27877hCmmadfVlqKm0repzrKWRoAtss73can4exJfSLAA35ranEBrsnTvLgZG3lbFpoiUrc2WYH7X5blev0kodg1vUyFVg3rSdTQLQMgoO/pfw43WbEpq46p/Gj2OSzfMQ0nznQuWMgUbf9BvwMs4UXzJZvWB9qEmmCJARt82tqiLhx86xu5KEphlsQB2Ciz8P0yOfeb/s4PGz7jjq4SP9W454si/OUfw6bc7fEwn1eReqYK63OeWCFs9IAUVj5adh1EnOKjeOAVTMVLpLJw5RQ9tBGnTCzD9q9BpzCRb4hX5TsP/dmp4fnXO4taH25GvcSuof9TYZ3eTzzX8Vcixnogtbq2vqfXETQyzpaLr8sNIrOGMnFwr+euckroZqAs57CXMz++b6B2JL47bxBXXje52l2NPq8NFwANmSQCIFWgEb/gedKgNdkNyqdq8NS4BFQCAekcaJU2/UeCyigRF1pJFUojyVCbfBH80UYUkwC2J/+P2dYIFSRmgFjtsE6kXkgCG+40hybwdqWyr4oJxbjQc9/iXsCnUba2pYAjcQLCKkKBVLPoTN2nVB2zVn9ivPxeGnWd4ECvAwkLm9br5CLgT9XOMbz0dabGOECKbqJGSESh+186byIVjr0oaEjs0+4qdFpa1EH7dN5fcl6mW3Pg3RultQpBGmH8lzmRuBJ8MZ8wFAOcCIXYH+hagtv1R3o+N5ey7u7R/6pwRWp3PKI50pYu7WBm1HCbV+PTqE+Hks+eeaVbCjZE/Ottc1JKPMyk29Rm4MtyPF3j4Yc5Ph5akvjCj9bcm8Ehj62F6VTRJ+u8RpVdySicWJoZ3lzwD0ADbpvUXKgFwOYbkYAhZNOlPjbU587GqjKSBYkMjSvMD/cleUs6xsKt8PITvCl8DZlbYG+/naiYRxuJ4d1YJiQVfIl0cTmFJlOjMb38Vzga2MQd8gWXh5eYlSTYApMu7Q71MshKCuh53//HHpEw4owhJlI7hRnUina5klyYWrjLnyb+W5c+tyO7sWNVsUVFSPCHRnS2O/00CBRh3P1UsCD7Sgj3+STlUdsUEcDd2FJQZgLLdgxjFiyZ+YG349Xi1vCNngmmmbBZpkSBqbMfamE7/MGTusQaqXwxLWgCr4adQDS77lH4U5dZcnMHLVSL85n+111MDz9w5FMvZzUStzMaguv+cQwrQY82Tuag4OS375MIrI7FfDYGgW8DhwfU/U6jGN+4cQC/W1MVXBTM5bm1yZtRimOD9g4qXQ4tvCf5K5zyeDNGRWivTle9Q92vr6c9AWdj7BJcW4/jfVcZqbsLcKxGY9GrvXDvI/+4n8RhemNzINzKnyNUeC40n16mZH+SSQgaUg0VM5nsOKdL83Cwh9t8x7rHAxnaS/At3JSEnL4NhDSSoJGq0Md4ee5EQiXrDuDbjnumSiuWea6pLhWm0VAFmejpLOqqjZuPV1B/MewTxi17NwGq8ln3/E20jiZy/Bj35r46k9YYo7L5Tm9tON2PHhXKapqF33DvGNuyNRdyGZCxD6gIXeQQKdVli+Qs4EC/G68pSMVFlKxeBqVL4beAMBZ2+9ZQ7zwJ/x+zgul+zOcU7vAi/I7RJQkIOkRTKpzMhSgw+vXtNWUWQw+9B0OUxqrT64mO07kOjLucyUyCjKUMGXCgcl+B3yeRVoN3YoJLnk+O2EXqPVwS7Jfifu6u3/H7rulKFQouUXp432k5l5tk7iFZ+VLM/71/5um5vzwghEev5DAdb6jGm/LtUUd7WrcfUE0KIDKrxNTZ1/LaqTkPEmvMmgAAHFqXIBSDh50umE3zoFbpMb2v6iAqRih7/KktkFWsp8dmn65X8qf1ZRY9bu/w+0H0Pn/rofBz7Cq75Bh08fo5sdGLVZNRIqt9sBB8T+XAbRsDHycng4z1MN3zK+ckJmvS9+o8I6I1TLxs+eTv6DwJyN805Cbj3KkRf3p/sT6HoW/kmCYZkrjQey1fjMB4Uo5XqHyKR+/wZjQvCjleot6Le91uy89EbvqxXWijt9MISnU4BxL7FBncwAbroZa/qNmaO92/w2Oqxxw9jillZiSj8bfJd1Ca/g/XSgMARsIjhQifr8Od4qfageXnXijtKwY9TWWEENC1k9soVEi4zJHB/FxFAFceq+GOnWvJGfGLhc96rE2oIbkQdgsStd2Rv9JdCMDIqRvITEqhR1bMA+m2TqcKyQF1/aALs9ypuJmT5V0U8qmvLctioJGNUz1l1z0EjWSJdUQF7/cPa8bxv7XXkuptxsNG+NFtVVPMOYd31hxJ6CL5dcW7L8ZWvGs88ZE2THid7hrzEQWnucO2SGnH6oOwH9wZUfkj+S4GWvs0oiDA8Cqr3+k8b/Ysgg2H8oqieW0R0SIGqZiSR1kSb46IPlu65ZdFJQZlrUF0nDkMYI9P9GGdLomYioOgypavrlPlhJpJAHpaBO9mN+fNiH+otRNyqGYAu+HDaCsPnzIq2CvfCS/5eCn0gqthrCCUvNqNLrt/jPsV0IrftSMJIi+CNN9kIb04fIJce3/iJr4qocpTZl0NY3jgmI1OV7UkNEsmdRUo/mtGIiM7mBZ6U9Xu3n8QxCV7q7E4JUMpwDnr8wN4UAJi9c4r1N1LztGhWvz1+0aMBmvFCZu7tq4CMYEhFvMD7WKDjl2Bxnu1QdiaI/0Y5gXcemS6PTtggjl5RpJPKmyyD4xwl68hkQjDJsb6NksT5L7QdEvdID/8KKutGDC+tT4cp3QfTJEL+UlVcsvKxA6FPw2H0RZeMs5lDZfhvVsHtZeT0yy41nZ3OrRsSjI4Lhm7HzKqJOo/X9QrfkLynMFYhhgQsGSHgJPUTb2I3a9wlDlbTslt/kf0cU5CCxuUxpoALmDsObdk5PzLUhq6kusmf5LS25BeR/4i7hHZJ2qpQBKHg3TPCppWe/4vhB3+c2XI31cw//HYmXXz8bXdmL1j5cB/RYW/m1KkMXIb2qJrDQpOciV15oJUM89v6jHYZmqelDos2asZwR3noEY9/8O5ptbXHcVSRJaTy0dpfYHdQg4DD5jD68Y/uYv/HBD0I/dl4fZbEFI+eE00V12OYY1NrV2ocdAjC/FIzzwGu3N4REyesk/5gdHcmlJmnW0jkJ6B4nNlu5csaM4GX7HiJcYK2PqjnIoGJl9qimiqvb/LTXeYlvPNjYsXlSa7vWkLuVZ/ZXUJhLujDdity/PJcFJRimqrSpHiiTJe8CJY8RMQFLjiHD854BPMOD/rv6l90TFyTXGa6RsbH/84MkRztLQi36kp43LR9yF/X8hmWeyYlP9+3WPnNhPLfWKCnKJWrpHuxIFEiOMpaBGjH8e52YmKgEnvOKl4B+bGFQey1S9l06Q4lgpqHeZ0RkvjT+oR6Tqn0ZrXSRcagahMLrHGSvFiPlKM3DjUX21WPXCrB1Kryi9AyfPOi225xUBNnbdTl4uJ0bXpNv2/mfqRWW+uhONXjqy0MsX3EWLfvfsuN/ZDn7ws2rJxXgdf7SFHceyq3t+B+zjFMGZ/cQamIZi1YBlYU9oQsoLasEMNsFb9EML7HueZIvIjFZk9tLO2G65y03tcgdZLtH+i9pIUbUFMuaSWScTValjI5/a4E7dFrpUgRy/ZY92Fh/+hk/1fEVyFJ7Upv/nodVkGBsOqVI8g3GnV+gdWLBL7YPLE9A8i4oE5UGTd5PCt1g92DS+m+pbycrHoYPsFhMYOOK1yneExVV9NZXPCiG0G6Kjf1wE9/L2I/5/6EgjPxeyFwW0ocwHh70ZsTm9JxxdC5Ld7x7mMV5iG1ehPL9cJCgdQRJtnGfkDhQAYRBScHyqQ6eM2PG1uwvigOlm5kzXEe4HHiSf8XGkyZzlHb4fgFB8zYdugo3sF7er2Y07z61SHLwhFktRRI+XM3+jCnK4RAPjqz5FMG8Wr+n7B/jcI/yrabiTKrVv9q/+5kfSVi24BIi4HxR92xz8KqgfOq2Mo9bDCqcMHvOnyX/nMubhzAebak2/RG5SdRkfmPJ087RLz/KU19n38k10Vk4+ELvmUDno1MwEt4cjan891xr+jybmrnsdDm0DsGYAYtBusk6KEq0/dvbd65IlznCO9MJX1Wl9OFWVoi08ubnhoqmIeDJE5SBmeX1IxbsFqgJRyXUmJjpPbWFVZdpnD/3AdtBTCRfLBOCJj4f6A14zSxXsxUH9mA8Bsz+9wihZJESDrbdrv8ZdvQzxfP/4zwpjHTNwP90P9dyMLF007vDNMyUKfUa/yDveCJZGkKnHGmP2ndSoe3jiRAWhyFKkpXzMJUGImmUa+b46lxT6W7LQtq9xkdLdiMWi5PmZW8jc5nmuftvCDLqBbAmw+NdAJXf/da/Jgu45VjmyeM9nwkL73ZAgPT3OfiEnfWHfJeX/SWXFCiOBTCfTBTaJqLRWL+WfjLPCbh4zfint/VKqtApOUcnyj3lezqCVS/PPny+N0HJNNaAqeRoR0w+oRTlw5XtI1J84zXbeDyYyiktz5J6v7zDQIRfREYvZMlNLcUHI2vFdef4Gl/Enk0JGcStch5ri7DaEj3Hbt8ndH8ddKhv/q9w8kJQYW+cGTwb7ekzqLpsydexS/CRqIt4+WYyMnCtzzYX2auADfR65ekwZgHiWZpu4Hpn7dRncsc4I9/ocC9UloQooafSZN1yHskCWpzZOreeR58mQ5d6WQ/0AavMHiFxGwO4RXABb08NyXUnqvnsXlff9oBZXLZpqilTGGcX7/e6oeIDhDga7VkNa7FjnamhOaZoxUwwOQ8GH2JZ4Bns80au8QG9rP0pv3QK3FHj911qp4cpuS7HTSlQQdLiCQ0XS3od39L7dZL3qmhxzBS5Q9LuIwLx80j5Gm5VJVW8j0uNbi1hxdSGqH+6Kn+8HS2pj/2dGQfPDKzn7yuqUKTpK4of49m6eJYLmnCFJsbTUUmk1iHVpOzG5r1pRy2hGtgqWvsI4sXPSklHLV6OCLbWlLKSfaqrKYJu/amW+AT0ZZj5IrQ4hkc6DLPKQxPc4EwwmQtSzl/1NjRtJLZhu2tLwCTGlXe8qpLOXvJNId3kej8qazIh7WJyL0swiGMoGxWuuJdJQRMeQjV9bdizHMGg2ExFGeWEZk/bbfCfZB8QI7hf3YyLMHGPDiIoDC/wqn7wazgvWo6k1zYcRBDf5Q63VsTuZ4zLK8imf+Jtp8RgCRdBSnj+rkrZtCl2bReQHhAj3ytXBh+aXsLrJ3x/bmdF1r+zgj49w9JKg3aV3E7Ab2ZFpAIjz/cYamYAT/SaJYmXksQ/S0dyDBUiaZpiYMwkJ/ax6ZeI9MyD9Y4QfZdn5v3i1o4/i5b/FzraLWWCpfRRUcZNNSh7J+G/Y1rpdNHoJ4lFKCH8VTOnan2lHS/RKX9nGgAE/ZsTLl9heyMdswnTIt8kEk3X/Qc/1DCqyHBpo+3QGlW6Dvmf81WuweuOMelk0bMaHtNO4hwIqs9G4xWrvUTJaaHrQGzKX8HLRL6EdBF5WBEYB2uFslf3ffv0MqNPSgm9yS0KNzeBAVlB3p2tW14J/EwIVt2yd2ZFzr6eQlcTC6QrY4lgJ+xnxoCUluox2yG9g0xdJSI+HaN/AFA4SzvVsM/m1vuCIu/9sDXtBeTG8WgIL0hXe8OLrMFz3Y0VwJb2OSOmWZKlSkJOtxxlu3itOM3b0S7eCyiW9Xu+8ySQHzWwxASwOKq4a17Yk5CRhIrPI/E+t1U6f7K6McR0QFtlFfpHE7J/VkH5Zm6NJWY7D7iWTXfPjsQLVIxl7NnnGy36xRZmoaAIYd2tyzLE+1XAYkfLkILi2vqa7Gx99ogprNtv9dCrUIVHNaxgy2G198HqD95gDGTTcuaDaQrbmtCp68r1sY5BSh8089yXIhkcyeGzrBMTBc/KNUmuDYUtAtR6WuI6HHU+NOJVphzqQOoyifGABkwjAAAA=" alt="Accroche-guidon Bikéo avec QR code"/><div className="homeProductPhone"><iframe src="/magasin/cycles-omega/velos/oiz-m-pro-2027" title="Fiche produit réelle Bikéo"/></div>
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
