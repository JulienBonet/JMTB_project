/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
import "./movieFocusThumbnail.css";

function MovieFocusThumbnail({ data, onClick }) {
  const { name, image: imageName } = data;
  const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  const getImageUrl = (image) => {
    if (!image) return `${CLOUDINARY_BASE_URL}/00_jmtb_item_default`;
    if (image.startsWith("http")) return image;
    return `${CLOUDINARY_BASE_URL}/${image}`;
  };
  return (
    <div
      key={data.id}
      className="FocusThumbnail"
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      onClick={onClick}
      tabIndex={0}
    >
      <img
        src={getImageUrl(imageName)}
        alt={name}
        className="image_FocusThumbnail"
      />
      <p className="name_FocusThumbnail">{name}</p>
    </div>
  );
}

export default MovieFocusThumbnail;
