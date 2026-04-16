import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/Kezdolap.css";

import pizzarenaDivHatter from "../assets/images/Hero.png";
import Etterem from "../assets/images/Etterem.jpg";
import SauceImg from "../assets/images/TokeletesPizza.jpg";
import PizzArenaIMG from "../assets/images/Etterem.jpg";
import PotatoImg from "../assets/images/OlaszAlapanyag.jpg";
import HamBunImg from "../assets/images/IzVilag.jpg";

const testimonials = [
  "A PizzAréna elhozta Olaszország ízvilágát.",
  "Ez a hely a legjobb pizzákat készíti Miskolcon!",
  "Barátságos kiszolgálás és fantasztikus ízek.",
  "Minden alkalommal lenyűgöz a minőség és a hangulat."
];

function Kezdolap() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [chefSpecials, setChefSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);

  useEffect(() => {
    async function fetchChefSpecials() {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("/api/ChefSpecial", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          setChefSpecials([]);
          return;
        }

        const data = await res.json();
        setChefSpecials(Array.isArray(data) ? data : data.result || []);
      } catch {
        setChefSpecials([]);
      } finally {
        setLoading(false);
      }
    }

    fetchChefSpecials();
  }, []);

  useEffect(() => {
    async function fetchRestaurants() {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("/api/Restaurant/", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          setRestaurants([]);
          return;
        }

        const data = await res.json();
        setRestaurants(Array.isArray(data) ? data : data.result || []);
      } catch {
        setRestaurants([]);
      } finally {
        setRestaurantsLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  function changeSlide(nextIndex) {
    setFade(false);

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setFade(true);
    }, 200);
  }

  function prevSlide() {
    const nextIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    changeSlide(nextIndex);
  }

  function nextSlide() {
    const nextIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
    changeSlide(nextIndex);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
        setFade(true);
      }, 200);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section
        id="BevezetoKep"
        className="hero"
        style={{ backgroundImage: `url(${pizzarenaDivHatter})` }}
      >
        <div className="hero__overlay" />

        <div className="hero__content hero__content--left">
          <h1 className="hero__title">PIZZARENA</h1>

          <div className="hero__actions">
            <Link to="/rendeles" className="btn btn--primary">
              Rendelés
            </Link>
            <Link to="/etlap" className="btn btn--ghost">
              Böngéssz az étlapon
            </Link>
          </div>
        </div>
      </section>

      <section id="ASefAjanlataSzekcio" className="section section--light">
        <div className="container">
          <h2 className="section__title">A séf ajánlata</h2>
          <p className="section__subtitle">
            Különleges fogások, amiket a séfünk szívből ajánl.
          </p>

          <div className="chef-grid">
            {loading ? (
              <p>Ajánlatok betöltése...</p>
            ) : (
              chefSpecials.map((item) => (
                <article
                  key={item.id || item.Id || item.product?.id || item.product?.Id}
                  className="card chef-card"
                >
                  <div className="card__image-wrapper">
                    <img
                      src={item.product?.image_Url || "/placeholder.jpg"}
                      alt={item.product?.name || "Termék"}
                      className="card__image"
                    />
                  </div>

                  <div className="card__content">
                    <h3 className="card__title">{item.product?.name || "Névtelen termék"}</h3>
                    <p className="card__text">{item.product?.description || "-"}</p>

                    {item.customNote && (
                      <p className="card__meta chef-note">
                        Megjegyzés: {item.customNote}
                      </p>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section section--light features-section">
        <div className="container">
          <div className="feature">
            <img src={SauceImg} alt="Tökéletes pizza" />
            <div className="feature__text">
              <h2>Nem hiszed el, hogy ez a valóság!</h2>
              <p>
                Pizzáinkat egy éven keresztül kísérleteztük a tökéletes íz
                eléréséhez.
              </p>
            </div>
          </div>

          <div className="feature feature--reverse">
            <img src={PizzArenaIMG} alt="PizzArena álma" />
            <div className="feature__text">
              <h2>PIZZARÉNA ÁLMA</h2>
              <p>
                Az álmunk egyszerű: az ország legfinomabb pizzáját hozzuk el
                nektek.
              </p>
            </div>
          </div>

          <div className="feature">
            <img src={PotatoImg} alt="Olasz alapanyagok" />
            <div className="feature__text">
              <h2>Olasz alapanyagokkal dolgozunk!</h2>
              <p>A legjobb minőségben hozzuk el a várt élményt.</p>
            </div>
          </div>

          <div className="feature feature--reverse">
            <img src={HamBunImg} alt="Ízvilág" />
            <div className="feature__text">
              <h2>NEM FOGOD ELHINNI, HOGY LÉTEZIK ILYEN ÍZVILÁG.</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--light carousel-section">
        <div className="container">
          <h2 className="section__title">Tőletek kaptuk</h2>

          <div className="carousel">
            <div className={`carousel__slide ${fade ? "fade-in" : "fade-out"}`}>
              <p>"{testimonials[currentIndex]}"</p>
            </div>

            <div className="carousel__controls">
              <button className="carousel__prev" onClick={prevSlide}>
                ‹
              </button>
              <button className="carousel__next" onClick={nextSlide}>
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark restaurants-section">
        <div className="container">
          <h2 className="section__title restaurants-title">Éttermeink</h2>
          <p className="section__subtitle restaurants-subtitle">
            Az ország több pontján várunk, hogy élőben is átélhesd a PizzArena
            hangulatot.
          </p>

          <div className="locations-grid">
            {restaurantsLoading ? (
              <p>Éttermek betöltése...</p>
            ) : (
              restaurants.map((place) => (
                <article
                  key={place.id || place.Id}
                  className="card location-card"
                >
                  <div className="card__image-wrapper">
                    <img
                      src={
                        place.imageUrl && place.imageUrl.startsWith("http")
                          ? place.imageUrl
                          : Etterem
                      }
                      alt={place.name || "Étterem"}
                      className="card__image"
                    />
                  </div>

                  <div className="card__content">
                    <h3 className="card__title">{place.name || "Névtelen étterem"}</h3>
                    <p className="card__text restaurant-address">
                      {place.address || "-"}
                    </p>
                    <p className="card__text">{place.description || "-"}</p>
                    <p className="card__meta">Nyitva: {place.openingHours || "-"}</p>
                    <p className="card__tel">Elérhetőség: {place.contactPhone || "-"}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Kezdolap;