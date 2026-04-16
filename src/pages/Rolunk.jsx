import "../assets/css/Rolunk.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Rolunk() {
  const navigate = useNavigate();

  const [ettermeink, setEttermeink] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch("/api/Restaurant/");

        if (!res.ok) {
          setEttermeink([]);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setEttermeink(data);
          return;
        }

        if (Array.isArray(data.result)) {
          setEttermeink(data.result);
          return;
        }

        setEttermeink([]);
      } catch {
        setEttermeink([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  return (
    <div className="rolunk-page">
      <section className="about-clean">
        <div className="about-clean-container">
          <div className="about-clean-images">
            <img
              src="https://cdn.pixabay.com/photo/2017/06/19/01/34/venice-2417879_1280.jpg"
              alt="Étterem belső tér"
              className="about-img about-img-large"
            />

            <div className="about-clean-small-row">
              <img
                src="https://cdn.pixabay.com/photo/2021/10/30/12/50/woman-6754248_1280.jpg"
                alt="Étel"
                className="about-img about-img-small"
              />

              <img
                src="https://cdn.pixabay.com/photo/2019/06/18/10/46/platting-4282016_1280.jpg"
                alt="Csapat"
                className="about-img about-img-small"
              />
            </div>
          </div>

          <div className="about-clean-content">
            <h1>Rólunk</h1>
            <h2>Egyszerűen jó pizza, korrekt minőségben</h2>

            <p>
              A Pizzarena célja egyszerű: jó pizzát készíteni gyorsan,
              átláthatóan, felesleges körök nélkül. Friss alapanyagokkal
              dolgozunk, és arra figyelünk, hogy minden rendelésnél ugyanazt a
              minőséget kapd.
            </p>

            <p>
              Nem bonyolítjuk túl. Egy helyet építünk, ahonnan nyugodtan
              rendelsz, mert tudod, mire számíthatsz.
            </p>

            <Link to="/etlap" className="about-clean-btn nav__link">
              Nézd meg az étlapot
            </Link>
          </div>
        </div>
      </section>
      
      <section className="cta">
        <div className="container">
          <div className="cta-card">
            <div>
              <h2 className="cta-title">Készen állsz rendelni?</h2>
              <p className="cta-text">
                Válassz kedvencedet az étlapról, és add le a rendelésed pár
                kattintással.
              </p>
            </div>

            <button
              className="btn btn-primary"
              type="button"
              onClick={() => navigate("/rendeles")}
            >
              Add le a rendelésed!
            </button>
          </div>
        </div>
      </section>

      <section className="places">
        <div className="container">
          <h2 className="section-title">Éttermeink</h2>
          <p className="section-lead">
            Miskolc több pontján várunk, hogy élőben is átéld a Pizzarena
            hangulatot.
          </p>

          <div className="place-grid">
            {loading ? (
              <p>Betöltés...</p>
            ) : (
              ettermeink.map((etterem) => (
                <article className="place-card" key={etterem.id || etterem.Id}>
                  <div className="place-imgWrap">
                    <img
                      className="place-img"
                      src={
                        etterem.imageUrl && etterem.imageUrl.startsWith("http")
                          ? etterem.imageUrl
                          : "/images/etterem1.jpg"
                      }
                      alt={etterem.name || "Étterem"}
                    />
                  </div>

                  <div className="place-body">
                    <h3 className="place-title">{etterem.name || "-"}</h3>

                    <p className="place-address">
                      {etterem.address || "-"}
                    </p>

                    <p className="place-desc">{etterem.description || "-"}</p>
                    <p className="place-open">Nyitva: {etterem.openingHours || "-"}</p>
                    <p className="place-open">Elérhetőség: {etterem.contactPhone || "-"}</p>

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
    </div>
  );
}