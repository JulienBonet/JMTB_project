import PropTypes from "prop-types";
import "./counters.css";

function Counters({ countAmount, origin }) {
  return (
    <section className="Amount_info_container_counter">
      {origin === "directors" && (
        <p className="Amount_info_counter">
          <span className="whiteString_counter">{countAmount}</span>{" "}
          réalisateurs
        </p>
      )}
      {origin === "casting" && (
        <p className="Amount_info_counter">
          <span className="whiteString_counter">{countAmount}</span> acteurs
        </p>
      )}
      {origin === "screenwriters" && (
        <p className="Amount_info_counter">
          <span className="whiteString_counter">{countAmount}</span> scénaristes
        </p>
      )}
    </section>
  );
}

// Validation des types des props
Counters.propTypes = {
  countAmount: PropTypes.number.isRequired,
  origin: PropTypes.string.isRequired,
};

export default Counters;
