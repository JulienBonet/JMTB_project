import "./movieCount.css";

function MovieCount({ movieAmount }) {
  return (
    <section className="Amount_info_container">
      <p className="Amount_info">
        NOMBRE DE FILMS : <span className="whiteString">{movieAmount}</span>
      </p>
    </section>
  );
}

export default MovieCount;
