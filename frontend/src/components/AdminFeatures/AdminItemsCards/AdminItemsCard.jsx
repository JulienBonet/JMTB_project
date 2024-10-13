/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ModeIcon from "@mui/icons-material/Mode";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CachedIcon from "@mui/icons-material/Cached";
import "./adminItemsCard.css";

function AdminItemsCard({ item, origin, onUpdate, closeModal }) {
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/images`;

  const [isModify, setIsModify] = useState(false);
  const [name, setName] = useState(item.name || "");
  const [pitch, setPitch] = useState(item.pitch || "");
  const [wikilink, setWikilink] = useState(item.wikilink || "");
  const [imdblink, setImdblink] = useState(item.imdblink || "");
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(`${backendUrl}/${item.image}`);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const fileInputRef = useRef(null);

  console.info("image:", image);

  const openModif = () => {
    setIsModify(true);
    setIsEditing(true);
  };

  const handleReturn = () => {
    closeModal();
  };

  const handleUpdateImage = async () => {
    const fileInput = fileInputRef.current;
    const file = fileInput.files[0];

    if (file) {
      const imageData = new FormData();
      imageData.append("image", file);

      const imageResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/${origin}/${item.id}/image`,
        {
          method: "PUT",
          body: imageData,
        }
      );

      if (imageResponse.ok) {
        console.info("Item image successfully updated");
      } else {
        console.error("Error updating item image");
      }
    }
  };

  const handleValidate = async () => {
    try {
      // 1. Vérifier s'il y a des changements dans les données textuelles
      const hasChanges =
        name !== item.name ||
        pitch !== item.pitch ||
        wikilink !== item.wikilink ||
        imdblink !== item.imdblink;

      if (hasChanges) {
        const data = {
          name,
          pitch,
          wikilink,
          imdblink,
        };

        // 1. Mettre à jour les infos textuelles (nom, pitch, etc.)
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/${origin}/${item.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          console.error("Error updating item");
          return;
        }
        console.info("Item successfully updated");
      }

      // 2. Mettre à jour l'image (s'il y a un fichier sélectionné)
      if (fileInputRef.current.files[0]) {
        await handleUpdateImage(); // Utilisation de await pour attendre la fin de la mise à jour de l'image
        console.info("Image successfully updated");
      }

      // 3. Réinitialiser les états locaux, déclencher la mise à jour du parent et fermer le modal
      toast.success(`${origin} successfully updated`, {
        className: "custom-toast",
      });

      setIsModify(false);
      setIsEditing(false);
      setShowUploadButton(true);

      onUpdate(); // Rafraîchir les données dans le composant parent
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  const handleUndo = () => {
    setIsModify(false);
    setIsEditing(false);
    setImage(`${backendUrl}/${item.image}`);
    setShowUploadButton(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const newImageUrl = URL.createObjectURL(file);
    setImage(newImageUrl);
    setShowUploadButton(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleResetImage = () => {
    setImage(`${backendUrl}/${item.image}`);
    setShowUploadButton(true);
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
            <section className="Item_Editing_Buttons">
              <KeyboardReturnIcon
                className="item_return_ico"
                onClick={handleReturn}
              />
              <ModeIcon
                className="item_tools_ico"
                onClick={() => openModif()}
              />
            </section>
          )}
        </div>
      </section>

      <section className="ItemsCard_Col2">
        {/* {image && (
          <img
            className="ItemImage"
            // src={`${backendUrl}/${image}`}
            src={image}
            alt={`${item.name}`}
          />
        )} */}
        {item && image && (
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
            {showUploadButton ? (
              <FileUploadIcon
                className="Item_uploadButton"
                onClick={handleUploadClick}
              />
            ) : (
              <CachedIcon
                className="Item_reset_img_Button"
                onClick={handleResetImage}
              />
            )}
          </>
        )}
      </section>
    </article>
  );
}

export default AdminItemsCard;
