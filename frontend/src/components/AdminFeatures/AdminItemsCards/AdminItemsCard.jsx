/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import ModeIcon from "@mui/icons-material/Mode";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "./adminItemsCard.css";

function AdminItemsCard({ item }) {
  const [isModify, setIsModify] = useState(false);
  const [name, setName] = useState(item.name);
  const [pitch, setPitch] = useState(item.pitch);
  const [wikilink, setWikilink] = useState(item.wikilink);
  const [imdblink, setImdblink] = useState(item.imdblink);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(item.image);
  const fileInputRef = useRef(null);

  console.info(image);
  const openModif = () => {
    setIsModify(true);
    setIsEditing(true);
  };

  const handleValidate = async () => {
    try {
      const data = {
        name,
        pitch,
        wikilink,
        imdblink,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/director/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.info(response);

      if (response.ok) {
        // Mise à jour réussie
        console.info("Director successfully updated");
        setIsModify(false);
        setIsEditing(false);
      } else {
        // Erreur de mise à jour
        console.error("Error updating director");
      }
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  const handleUndo = () => {
    setIsModify(false);
    setIsEditing(false);
    setImage(item.image);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const newImageUrl = URL.createObjectURL(file);
    setImage(newImageUrl);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <article className="ItemsCard">
      <section className="ItemsCard_Col1">
        <div className="Info_item_line">
          <h2 className="ItemsCard_title">ID: </h2>
          <p className="Items_info">{item.id}</p>
        </div>
        <div className="Info_item_line">
          <h2 className="ItemsCard_title">NAME: </h2>
          {isModify ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="Items_info">{name}</p>
          )}
        </div>
        <div className="Info_item_line">
          <h2 className="ItemsCard_title">PITCH: </h2>
          {isModify ? (
            <input
              type="text"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
            />
          ) : (
            <p className="Items_info">{pitch}</p>
          )}
        </div>
        <div className="Info_item_line">
          <h2 className="ItemsCard_title">WIKIPEDIA: </h2>
          {isModify ? (
            <input
              type="text"
              value={wikilink}
              onChange={(e) => setWikilink(e.target.value)}
            />
          ) : (
            <p className="Items_info">{wikilink}</p>
          )}
        </div>
        <div className="Info_item_line">
          <h2 className="ItemsCard_title">IMDB: </h2>
          {isModify ? (
            <input
              type="text"
              value={imdblink}
              onChange={(e) => setImdblink(e.target.value)}
            />
          ) : (
            <p className="Items_info">{imdblink}</p>
          )}
        </div>
        <div className="Info_Btn-Modify">
          {isEditing ? (
            <section className="Item_Editing_Buttons">
              <DoneOutlineIcon
                className="Item_validateButton"
                onClick={handleValidate}
              />
              <UndoIcon className="Item_UndoButton" onClick={handleUndo} />
            </section>
          ) : (
            <ModeIcon className="item_tools_ico" onClick={() => openModif()} />
          )}
        </div>
      </section>
      <section className="ItemsCard_Col2">
        {image && (
          <img className="ItemImage" src={image} alt={`${item.name}`} />
        )}
        {isModify && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <FileUploadIcon
              className="Item_uploadButton"
              onClick={handleUploadClick}
            />
          </>
        )}
      </section>
    </article>
  );
}

export default AdminItemsCard;
