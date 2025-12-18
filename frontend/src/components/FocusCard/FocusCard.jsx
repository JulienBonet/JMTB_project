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

  const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
  const getImageUrl = (image) => {
    if (!image) return `${CLOUDINARY_BASE_URL}/00_jmtb_item_default`;
    if (image.startsWith("http")) return image;
    return `${CLOUDINARY_BASE_URL}/${image}`;
  };

  const imageUrl = getImageUrl(selectedFocus.image);
  const ArtistFocus = origin === "ArtistFocus";

  const focusLinks = [
    { key: "wikilink", icon: wikipediaIco, alt: "Wikipedia" },
    { key: "imdblink", icon: imdbIco, alt: "IMDb" },
    { key: "senscritiquelink", icon: senscritiqueIco, alt: "Sens Critique" },
    { key: "websitelink", icon: webIco, alt: "Website" },
  ];

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
          <div className="focusCard_divider_dashed" />
          {ArtistFocus &&
            focusLinks.some((link) => selectedFocus?.[link.key]) && (
              <div className="focusCard_ico_container">
                {focusLinks.map(
                  ({ key, icon, alt }) =>
                    selectedFocus?.[key] && (
                      <a
                        key={key}
                        href={selectedFocus[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={icon} alt={alt} className="focusCard_ico" />
                      </a>
                    )
                )}
              </div>
            )}
        </div>
      </section>
    </article>
  );
}

export default FocusCard;
