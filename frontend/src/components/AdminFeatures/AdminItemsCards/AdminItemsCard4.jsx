/* eslint-disable react/prop-types */
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

function AdminItemsCard4({ item, origin, onUpdate, closeModal }) {
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/images`;

  const [isModify, setIsModify] = useState(false);
  const [name, setName] = useState(item.name);
  const [pitch, setPitch] = useState(item.pitch);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(`${backendUrl}/${item.image}`);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const fileInputRef = useRef(null);

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
        return `${backendUrl}/${file.name}`; // Retourne la nouvelle URL de l'image
      }
      console.error("Error updating item image");
    }
    return null; // Retourne null si aucun fichier n'est sélectionné
  };

  const handleValidate = async () => {
    try {
      const hasChanges = name !== item.name || pitch !== item.pitch;

      if (hasChanges) {
        const data = {
          name,
          pitch,
        };

        // 1. Mettre à jour les infos
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

      // 2. Mettre à jour l'image
      let newImageUrl = image; // Garde l'ancienne URL par défaut
      if (fileInputRef.current.files[0]) {
        newImageUrl = await handleUpdateImage(); // Récupère la nouvelle URL
        console.info("Image successfully updated");
      }

      // Mettre à jour l'état avec la nouvelle URL d'image
      if (newImageUrl) {
        setImage(newImageUrl); // Met à jour l'image
      }

      // 3. Réinitialiser les états locaux
      toast.success(`${origin} successfully updated`, {
        className: "custom-toast",
      });
      setIsModify(false);
      setIsEditing(false);
      setShowUploadButton(true);

      onUpdate(); // Rafraîchir les données dans le composant parent
      closeModal(); // Fermer le modal après tout
    } catch (error) {
      console.error("Request error:", error);
    }
  };
  const handleUndo = () => {
    setIsModify(false);
    setIsEditing(false);
    setImage(item.image);
    setShowUploadButton(true);
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
    setImage(item.image);
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

export default AdminItemsCard4;
