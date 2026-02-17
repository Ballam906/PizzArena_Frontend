import "../assets/css/Rolunk.css";
import { useNavigate } from "react-router-dom";

export default function Rolunk() {
  const navigate = useNavigate();

  const ettermeink = [
    {
      name: "Blaha",
      desc:
        "Központi elhelyezkedés, gyors kiszolgálás és barátságos légkör – tökéletes munka utáni találkozókhoz.",
      open: "Nyitva: H–V 11:00–23:00",
      img: "/images/etterem1.jpg", // cseréld a saját útvonaladra
    },
    {
      name: "Corvin",
      desc:
        "Modern, fiatalos belső tér, kényelmes ülőhelyek és nagy társaságokra szabott asztalok.",
      open: "Nyitva: H–V 11:30–23:30",
      img: "/images/etterem2.jpg",
    },
    {
      name: "Buda",
      desc:
        "Nyugodtabb környék, családbarát hangulat, terasz jó idő esetén – ideális hétvégi ebédekhez.",
      open: "Nyitva: H–V 12:00–22:30",
      img: "/images/etterem3.jpg",
    },
  ];

  return (
    <div className="rolunk-page">
      {/* RÓLUNK */}
      <section className="about">
        <div className="container">
          <h1 className="page-title">Rólunk</h1>
          <p className="page-lead">
            A Pizzarenánál a cél egyszerű: olyan pizzát adni, amitől azt érzed,
            “na ez az!”. Friss tészta, jól eltalált szósz, bőséges feltét, és
            gyors kiszolgálás — akár beülsz, akár elvitelre kéred.
          </p>

          <div className="about-grid">
            <div className="about-card">
              <h2>Miért pont nálunk?</h2>
              <p>
                Nálunk nem kell kompromisszum: a minőség és a gyorsaság együtt
                működik. A kedvenceket stabilan ugyanazzal az ízzel kapod, a
                szezonális újdonságokkal pedig néha rá is csavarunk a sztorira.
              </p>
            </div>

            <div className="about-card">
              <h2>Amit ígérünk</h2>
              <ul className="promise">
                <li><span className="dot" /> Friss alapanyagok, korrekt adagok</li>
                <li><span className="dot" /> Gyors elkészítés, átlátható rendelés</li>
                <li><span className="dot" /> Barátságos hangulat, több helyszín</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ÉTTERMEINK ugyanazon a lapon */}
      <section className="places">
        <div className="container">
          <h2 className="section-title">Éttermeink</h2>
          <p className="section-lead">
            Miskolc több pontján várunk, hogy élőben is átéld a Pizzarena hangulatot.
          </p>

          <div className="place-grid">
            {ettermeink.map((p) => (
              <article className="place-card" key={p.name}>
                <div className="place-imgWrap">
                  <img className="place-img" src={p.img} alt={p.name} />
                </div>

                <div className="place-body">
                  <h3 className="place-title">{p.name}</h3>
                  <p className="place-desc">{p.desc}</p>
                  <p className="place-open">{p.open}</p>

                  <div className="place-actions">
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => navigate("/rendeles")}
                    >
                      Ide rendelek
                    </button>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => navigate("/etlap")}
                    >
                      Étlap
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA marad */}
      <section className="cta">
        <div className="container">
          <div className="cta-card">
            <div>
              <h2 className="cta-title">Készen állsz rendelni?</h2>
              <p className="cta-text">
                Válassz kedvencedet az étlapról, és add le a rendelésed pár kattintással.
              </p>
            </div>

            <button className="btn btn-primary" onClick={() => navigate("/rendeles")}>
              Add le a rendelésed!
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
