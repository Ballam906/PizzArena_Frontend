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
  "A PizzAréna elhozta a Olaszország ízvilágát.",
  "Ez a hely a legjobb pizzákat készíti Miskolcon!",
  "Barátságos kiszolgálás és fantasztikus ízek.",
  "Minden alkalommal lenyűgöz a minőség és a hangulat."
];

export default function Kezdolap() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const [chefSpecials, setChefSpecials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);

 
  useEffect(() => {
    async function fetchChefSpecials() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/ChefSpecial", {
            headers: {
              Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setChefSpecials(data);
      } catch (err) {
        console.error("Hiba a séf ajánlatának betöltésekor:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChefSpecials();
  }, []);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/Restaurant/", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error("Hiba az éttermek betöltésekor:", err);
      } finally {
        setRestaurantsLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setFade(true);
    }, 200);
  };

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
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
                <article key={item.id} className="card chef-card">
                  <div className="card__image-wrapper">
                    <img
                      src={item.product?.image_Url || "/placeholder.jpg"}
                      alt={item.product?.name || "Termék"}
                      className="card__image"
                    />
                  </div>
                  <div className="card__content">
                    <h3 className="card__title">{item.product?.name}</h3>
                    <p className="card__text">{item.product?.description}</p>
                    {item.customNote && (
                      <p
                        className="card__meta"
                        style={{ fontStyle: "italic", color: "#e67e22" }}
                      >
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
            <img src={SauceImg} alt="Sauce" />
            <div className="feature__text">
              <h2>Nem hiszed el, hogy ez a valóság!</h2>
              <p>
                Pizzáinkat egy éven keresztül kisérleteztünk a tökéletes íz
                eléréshez.
              </p>
            </div>
          </div>

          <div className="feature feature--reverse">
            <img src={PizzArenaIMG} alt="PizzArena álma" />
            <div className="feature__text">
              <h2>PIZZARÉNA ÁLMA</h2>
              <p>
                Az álmunk egyszerű, az ország legfinomabb pizzáját hozzuk el
                nektek.
              </p>
            </div>
          </div>

          <div className="feature">
            <img src={PotatoImg} alt="Dutch Fries" />
            <div className="feature__text">
              <h2>Olasz alapanyagokkal dolgozunk!</h2>
              <p>A legnagyobb minőségben hozzuk el a várt minőséget.</p>
            </div>
          </div>

          <div className="feature feature--reverse">
            <img src={HamBunImg} alt="Ham Bun" />
            <div className="feature__text">
              <h2>NEM FOGOD ELHINNI, HOGY LÉTEZIK ILYEN IZVILÁG.</h2>
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

      <section
        className="section section--dark"
        style={{
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          padding: "50px 0"
        }}
      >
        <div className="container">
          <h2 className="section__title" style={{ color: "#ffffff" }}>
            Éttermeink
          </h2>
          <p className="section__subtitle" style={{ color: "#eeeeee" }}>
            Az ország több pontján várunk, hogy élőben is átélhesd a Pizzarena
            hangulatot.
          </p>

          <div className="locations-grid">
            {restaurantsLoading ? (
              <p>Éttermek betöltése...</p>
            ) : (
              restaurants.map((place) => (
                <article key={place.id} className="card location-card">
                  <div className="card__image-wrapper">
                    <img
                      src={
                        place.imageUrl && place.imageUrl.startsWith("http")
                          ? place.imageUrl
                          : Etterem
                      }
                      alt={place.name}
                      className="card__image"
                    />
                  </div>
                  <div className="card__content">
                    <h3 className="card__title">{place.name}</h3>
                    <p
                      className="card__text"
                      style={{ fontWeight: "bold", color: "#ffcc00" }}
                    >
                      {place.address}
                    </p>
                    <p className="card__text">{place.description}</p>
                    <p className="card__meta">Nyitva: {place.openingHours}</p>
                    <p className="card__tel">Elérhetőség: {place.contactPhone}</p>
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