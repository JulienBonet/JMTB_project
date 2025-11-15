/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
import "./movieFocusThumbnail.css";

function MovieFocusThumbnail({ data, onClick }) {
  const { name, image } = data;
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  return (
    <div
      key={data.id}
      className="FocusThumbnail"
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      onClick={onClick}
      tabIndex={0}
    >
      <img
        src={`${backendUrl}/images/${image}`}
        alt={name}
        className="image_FocusThumbnail"
      />
      <p className="name_FocusThumbnail">{name}</p>
    </div>
  );
}

export default MovieFocusThumbnail;
