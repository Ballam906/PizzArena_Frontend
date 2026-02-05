import { Link } from "react-router-dom";
import "./fooldal.css";

function Fooldal() {
  return (
    <>
      <section>
        <div className="hero-section">
        <h2 className="PizzaArenaTextMain">PizzaAréna</h2>
        <p>Kézműves pizzák, friss tészták, házias főételek.</p>
      </div>
      </section>

      <section>
            <div className="RolunkDivResz">
              <h2>Rólunk</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora optio
                recusandae repellendus odit nostrum rem in architecto eligendi. Optio, enim
                fugit repellendus sit ad necessitatibus ex labore reprehenderit nemo ipsa
                odio adipisci, mollitia reiciendis vitae inventore explicabo eum eaque
                delectus dolores doloremque odit! Reiciendis sed quasi impedit dicta
                dolores. Deleniti voluptatem dicta alias! Facilis distinctio ut est
                dignissimos commodi itaque eveniet alias? Minima beatae recusandae ea earum
                magnam laboriosam illo tempore natus sed, eos, vel quasi odit dolor
                cupiditate necessitatibus doloremque? Optio assumenda labore asperiores ab
                delectus aut fuga nulla? Veniam dolore quasi voluptas fugiat, ad culpa
                molestiae tempore enim.
              </p>
              
              <button>
                <Link to="/rolunk">Ismerj meg minket!</Link>
              </button>
            </div>
      </section>

    
    </>
  );
}

export default Fooldal;
