import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/Kezdolap.css";

import pizzarenaDivHatter from "../assets/images/KezdolapHEaderDiv.jpg";
import ASF1_SonkasPizza from "../assets/images/ASF1_SonkasPizza.jpg";
import ASF2_tbonesteak from "../assets/images/ASF2_tbonesteak.jpg";
import ASF3_gordonbleu from "../assets/images/ASF3_gordonbleu.jpg";
import Etterem from "../assets/images/Etterem.jpg";

import SauceImg from "../assets/images/ASF1_SonkasPizza.jpg";
import SimonImg from "../assets/images/Etterem.jpg";
import PotatoImg from "../assets/images/ASF1_SonkasPizza.jpg";
import HamBunImg from "../assets/images/ASF1_SonkasPizza.jpg";

const testimonials = [
  "A Simon's burger elhozta a smash Amerikát.",
  "Ez a hely a legjobb hamburgereket készíti Budapesten!",
  "Barátságos kiszolgálás és fantasztikus ízek.",
  "Minden alkalommal lenyűgöz a minőség és a hangulat."
];

export default function Kezdolap() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setFade(true);
    }, 200);
  };

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setFade(true);
    }, 200);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
                <img src={ASF1_SonkasPizza} alt="Sonkás pizza" className="card__image" />
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
                <img src={ASF2_tbonesteak} alt="T-bone steak" className="card__image" />
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
                <img src={ASF3_gordonbleu} alt="Gordon bleu" className="card__image" />
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

      {/* FEATURE SZEKCIÓK */}
      <section className="section section--light features-section">
        <div className="container">
          <div className="feature">
            <img src={SauceImg} alt="Sauce" />
            <div className="feature__text">
              <h2>NO WAY HOW ON EARTH IS THIS SAUCE SO DELICIOUS!</h2>
              <p>
                Delicious right? We know. We experimented for 1 year to create the perfect sauce.
                It contains 17 ingredients, we think nothing is missing. Simply perfect.
              </p>
            </div>
          </div>

          <div className="feature feature--reverse">
            <img src={SimonImg} alt="Simon's Dream" />
            <div className="feature__text">
              <h2>SIMON'S DREAM</h2>
              <p>
                Simon's dream is very simple. To bring the world's best hamburger to Hungary...
              </p>
            </div>
          </div>

          <div className="feature">
            <img src={PotatoImg} alt="Dutch Fries" />
            <div className="feature__text">
              <h2>WE ONLY WORK WITH DUTCH FRIES</h2>
              <p>
                With potatoes, we focused on the highest level of quality...
              </p>
            </div>
          </div>

          <div className="feature feature--reverse">
            <img src={HamBunImg} alt="Ham Bun" />
            <div className="feature__text">
              <h2>YOU WON'T BELIEVE HOW SOOOOOFT THE HAM BUN IS</h2>
            </div>
          </div>
        </div>
      </section>

      {/* CAROUSEL / TESTIMONIALS */}
      <section className="section section--light carousel-section">
        <div className="container">
          <h2 className="section__title">THE BUDAPESTER</h2>
          <div className="carousel">
            <div className={`carousel__slide ${fade ? "fade-in" : "fade-out"}`}>
              <p>"{testimonials[currentIndex]}"</p>
            </div>
            <div className="carousel__controls">
              <button className="carousel__prev" onClick={prevSlide}>‹</button>
              <button className="carousel__next" onClick={nextSlide}>›</button>
            </div>
          </div>
        </div>
      </section>

      {/* ÉTTERMEINK */}
      <section className="section section--dark">
        <div className="container">
          <h2 className="section__title section__title--light">Éttermeink</h2>
          <p className="section__subtitle section__subtitle--light">
            Miskolc több pontján várunk, hogy élőben is átélhesd a Pizzarena hangulatot.
          </p>

          <div className="locations-grid">
            <article className="card location-card">
              <div className="card__image-wrapper">
                <img src={Etterem} alt="Pizzarena Blaha étterem" className="card__image"/>
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
                <img src={Etterem} alt="Pizzarena Corvin étterem" className="card__image"/>
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
                <img src={Etterem} alt="Pizzarena Buda étterem" className="card__image"/>
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

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div>
              <h3>Kapcsolat</h3>
              <p>Email: info@pizzarena.hu</p>
              <p>Telefon: +36 70 123 4567</p>
            </div>
            <div>
              <h3>Nyitvatartás</h3>
              <p>H–V 11:00–23:00</p>
            </div>
            <div>
              <h3>Kövess minket</h3>
              <p>Facebook | Instagram</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}