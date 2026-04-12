import "../assets/css/Rolunk.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // 1. Hookok importálása

export default function Rolunk() {
  const navigate = useNavigate();
  
  // 2. State-ek létrehozása
  const [ettermeink, setEttermeink] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Adatlekérés az API-ból
  useEffect(() => {
    fetch("/api/Restaurant/")
      .then((res) => res.json())
      .then((data) => {
        setEttermeink(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="rolunk-page">
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
                működik. A kedvenceket stabilan ugyanazzal az ízzel kapod...
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

      <section className="places">
        <div className="container">
          <h2 className="section-title">Éttermeink</h2>
          <p className="section-lead">
            Miskolc több pontján várunk, hogy élőben is átéld a Pizzarena hangulatot.
          </p>

          <div className="place-grid">
            {loading ? (
              <p>Betöltés...</p>
            ) : (
              ettermeink.map((p) => (
                <article className="place-card" key={p.id}> 
                  <div className="place-imgWrap">
                    <img 
                      className="place-img" 
                      src={p.imageUrl && p.imageUrl.startsWith("http") ? p.imageUrl : "/images/etterem1.jpg"} 
                      alt={p.name} 
                    />
                  </div>

                  <div className="place-body">
                    <h3 className="place-title">{p.name}</h3>
                    {/* Itt megjelenítjük a címet is, mert a JSON-ben benne van */}
                    <p className="place-address" style={{fontSize: "0.9rem", color: "#e67e22", marginBottom: "5px"}}>
                      {p.address}
                    </p>
                    <p className="place-desc">{p.description}</p>
                    <p className="place-open">Nyitva: {p.openingHours}</p>
                    <p className="place-open">Elérhetőség: {p.contactPhone}</p>

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
              ))
            )}
          </div>
        </div>
      </section>

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