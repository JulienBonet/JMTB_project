/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import "./FocusCard.css";
import "./FocusCardMediaQueries.css";
import "../../assets/css/reactQuill_html_parametrage.css";
import DOMPurify from "dompurify";

function FocusCard({ selectedFocus, origin }) {
  console.info("selectedFocus", selectedFocus);
  console.info("origin", origin);

  if (!selectedFocus) return null;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const imageUrl = `${backendUrl}/images/${selectedFocus.image}`;

  return (
    <article className="focusCard_container">
      <section className="focusCard_content">
        <img
          src={imageUrl}
          alt={selectedFocus.name}
          className="focusCard_image"
        />

        <div className="focusCard_text_container">
          <h2 className="focusCard_titre">{selectedFocus.name}</h2>
          <div className="focusCard_divider" />
          <p
            className="focusCard_Pitch"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(selectedFocus.pitch),
            }}
          />
        </div>
      </section>
    </article>
  );
}

export default FocusCard;
