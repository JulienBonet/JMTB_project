/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import "./FocusCard.css";
import "./FocusCardMediaQueries.css";
import "../../assets/css/reactQuill_html_parametrage.css";
import DOMPurify from "dompurify";
import wikipediaIco from "../../assets/ico/wikipedia_ico.png";
import imdbIco from "../../assets/ico/imdb_ico.png";
import senscritiqueIco from "../../assets/ico/sens_critique_ico.png";
import webIco from "../../assets/ico/web_ico.png";

function FocusCard({ selectedFocus, origin }) {
  if (!selectedFocus) return null;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const imageUrl = `${backendUrl}/images/${selectedFocus.image}`;
  const ArtistFocus = origin === "ArtistFocus";

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
          {ArtistFocus &&
            (selectedFocus?.wikilink ||
              selectedFocus?.imdblink ||
              selectedFocus?.senscritiquelink ||
              selectedFocus?.websitelink) && (
              <>
                <div className="focusCard_divider_dashed" />
                <div className="focusCard_ico_container">
                  {selectedFocus.wikilink && (
                    <a
                      href={selectedFocus.wikilink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focusCard_ico_container"
                    >
                      <img
                        src={wikipediaIco}
                        alt="wikipedia"
                        className="focusCard_ico"
                      />
                    </a>
                  )}
                  {selectedFocus.imdblink && (
                    <a
                      href={selectedFocus.imdblink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focusCard_ico_container"
                    >
                      <img src={imdbIco} alt="imdb" className="focusCard_ico" />
                    </a>
                  )}
                  {selectedFocus.senscritiquelink && (
                    <a
                      href={selectedFocus.senscritiquelink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focusCard_ico_container"
                    >
                      <img
                        src={senscritiqueIco}
                        alt="Sens Critique"
                        className="focusCard_ico"
                      />
                    </a>
                  )}
                  {selectedFocus.websitelink && (
                    <a
                      href={selectedFocus.websitelink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focusCard_ico_container"
                    >
                      <img
                        src={webIco}
                        alt="website"
                        className="focusCard_ico"
                      />
                    </a>
                  )}
                </div>
              </>
            )}
        </div>
      </section>
    </article>
  );
}

export default FocusCard;
