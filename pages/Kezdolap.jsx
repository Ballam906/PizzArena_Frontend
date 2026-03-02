// src/pages/Kezdolap.jsx - 2025.12.02
import { Link } from "react-router-dom";
import "../assets/css/Kezdolap.css";
import pizzarenaDivHatter from "../assets/images/KezdolapHEaderDiv.jpg";
import ASF1_SonkasPizza from "../assets/images/ASF1_SonkasPizza.jpg";
import ASF2_tbonesteak from "../assets/images/ASF2_tbonesteak.jpg";
import ASF3_gordonbleu from "../assets/images/ASF3_gordonbleu.jpg";
import Etterem from "../assets/images/Etterem.jpg";

function Kezdolap() {
  return (
    <>
      {/* HERO / BEVEZETŐ */}
      <section
        id="BevezetoKep"
        className="hero"
        style={{ backgroundImage: `url(${pizzarenaDivHatter})` }}
      >
        <div className="hero__overlay" />
        <div className="hero__content">
          <p className="hero__subtitle">
            Ropogós tészta, válogatott alapanyagok és barátságos hangulat – legyen
            szó egy gyors ebédről vagy egy hosszú, beszélgetős estéről.
          </p>
          <div className="hero__actions">
            <Link to="/rendeles" className="btn btn--primary">
              Rendelés indítása
            </Link>
            <Link to="/etlap" className="btn btn--ghost">
              Böngéssz az étlapon
            </Link>
          </div>
        </div>
      </section>

      {/* A SÉF AJÁNLATA */}
      <section id="ASefAjanlataSzekcio" className="section section--light">
        <div className="container">
          <h2 className="section__title">A séf ajánlata</h2>
          <p className="section__subtitle">
            Három fogás, amit a séfünk bármikor szívből ajánl.
          </p>

          <div className="chef-grid">
            <article className="card chef-card">
              <div className="card__image-wrapper">
                <img
                  src={ASF1_SonkasPizza}
                  alt="Sonkás pizza"
                  className="card__image"
                />
              </div>
              <div className="card__content">
                <h3 className="card__title">Klasszikus sonkás pizza</h3>
                <p className="card__text">
                  Klasszikus olasz pizza ropogós tésztán, gazdagon megpakolva
                  zamatos sonkával és olvadt sajttal — egyszerű, mégis
                  ellenállhatatlan ízvilág minden alkalomra.
                </p>
              </div>
            </article>

            <article className="card chef-card">
              <div className="card__image-wrapper">
                <img
                  src={ASF2_tbonesteak}
                  alt="T-bone steak"
                  className="card__image"
                />
              </div>
              <div className="card__content">
                <h3 className="card__title">T-bone steak</h3>
                <p className="card__text">
                  Prémium marhahús két textúrával egy szeletben: omlós bélszín
                  és szaftos hátszín tökéletesre sütve, fűszeres vajjal és
                  grillezett körettel tálalva.
                </p>
              </div>
            </article>

            <article className="card chef-card">
              <div className="card__image-wrapper">
                <img
                  src={ASF3_gordonbleu}
                  alt="Gordon bleu"
                  className="card__image"
                />
              </div>
              <div className="card__content">
                <h3 className="card__title">Gordon bleu</h3>
                <p className="card__text">
                  Ropogósra sült, aranybarna panírban omlós csirkemell, ízletes
                  sonkával és olvadt sajttal töltve — igazi házias kedvenc,
                  frissen tálalva.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ÉTTERMEINK */}
      <section className="section section--dark">
        <div className="container">
          <h2 className="section__title section__title--light">
            Éttermeink
          </h2>
          <p className="section__subtitle section__subtitle--light">
            Miskolc több pontján várunk, hogy élőben is átélhesd a Pizzarena
            hangulatot.
          </p>

          <div className="locations-grid">
            <article className="card location-card">
              <div className="card__image-wrapper">
                <img
                  src={Etterem}
                  alt="Pizzarena Blaha étterem"
                  className="card__image"
                />
              </div>
              <div className="card__content">
                <h3 className="card__title">Blaha</h3>
                <p className="card__text">
                  Központi elhelyezkedés, gyors kiszolgálás és barátságos
                  légkör – tökéletes munka utáni találkozókhoz.
                </p>
                <p className="card__meta">Nyitva: H–V 11:00–23:00</p>
              </div>
            </article>

            <article className="card location-card">
              <div className="card__image-wrapper">
                <img
                  src={Etterem}
                  alt="Pizzarena Corvin étterem"
                  className="card__image"
                />
              </div>
              <div className="card__content">
                <h3 className="card__title">Corvin</h3>
                <p className="card__text">
                  Modern, fiatalos belső tér, kényelmes ülőhelyek és nagy
                  társaságokra szabott asztalok.
                </p>
                <p className="card__meta">Nyitva: H–V 11:30–23:30</p>
              </div>
            </article>

            <article className="card location-card">
              <div className="card__image-wrapper">
                <img
                  src={Etterem}
                  alt="Pizzarena Buda étterem"
                  className="card__image"
                />
              </div>
              <div className="card__content">
                <h3 className="card__title">Buda</h3>
                <p className="card__text">
                  Nyugodtabb környék, családbarát hangulat, terasz jó idő
                  esetén – ideális hétvégi ebédekhez.
                </p>
                <p className="card__meta">Nyitva: H–V 12:00–22:30</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

export default Kezdolap;
