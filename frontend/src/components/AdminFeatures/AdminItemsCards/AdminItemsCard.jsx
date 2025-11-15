/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
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
  const [birthDate, setBirthDate] = useState(item.birthDate || "");
  const [deathDate, setDeathDate] = useState(item.deathDate || "");
  const [isFocus, setIsFocus] = useState(item.isFocus || "");
  const [image, setImage] = useState(`${backendUrl}/${item.image}`);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const fileInputRef = useRef(null);

  const isArtistFocus = origin === "director" || origin === "casting";

  const openModif = () => {
    setIsModify(true);
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
      if (
        isArtistFocus &&
        Boolean(isFocus) &&
        (!birthDate || birthDate === "")
      ) {
        toast.error(
          "Impossible de valider : une date de naissance est obligatoire pour créer ce Focus.",
          { className: "custom-toast" }
        );
        return;
      }

      const hasChanges =
        name !== item.name ||
        pitch !== item.pitch ||
        wikilink !== item.wikilink ||
        imdblink !== item.imdblink ||
        (isArtistFocus && birthDate !== item.birthDate) ||
        (isArtistFocus && deathDate !== item.deathDate) ||
        (isArtistFocus && isFocus !== item.isFocus);

      if (hasChanges) {
        const data = {
          name,
          pitch,
          wikilink,
          imdblink,
        };

        if (isArtistFocus) {
          data.birthDate = birthDate || null;
          data.deathDate = deathDate || null;
          data.isFocus = Boolean(isFocus);
        }

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

      // Image
      if (fileInputRef.current.files[0]) {
        await handleUpdateImage();
        console.info("Image successfully updated");
      }

      toast.success(`${origin} successfully updated`, {
        className: "custom-toast",
      });

      setIsModify(false);
      setShowUploadButton(true);

      onUpdate();
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  // Fonctions pour filtrer les caractères interdits
  const regexInput = (value) => {
    return value.replace(/[/\\]/g, "-");
  };

  const handleNameChange = (e) => {
    const sanitizedValue = regexInput(e.target.value);
    setName(sanitizedValue);
  };
  // end Fonctions pour filtrer les caractères interdits

  const handleUndo = () => {
    setIsModify(false);
    setName(item.name);
    setPitch(item.pitch);
    setBirthDate(item.birthDate);
    setDeathDate(item.deathDate);
    setWikilink(item.wikilink);
    setImdblink(item.imdblink);
    setIsFocus(item.isFocus);
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
            <input type="text" value={name} onChange={handleNameChange} />
          ) : (
            <p className="Items_info">{name}</p>
          )}
        </div>

        {isArtistFocus && (
          <div className="Info_item_line">
            <h2 className="ItemsCard_title">BIRTH: </h2>
            {isModify ? (
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            ) : (
              <p className="Items_info">{birthDate}</p>
            )}
          </div>
        )}

        {isArtistFocus && (
          <div className="Info_item_line">
            <h2 className="ItemsCard_title">DEATH: </h2>
            {isModify ? (
              <input
                type="text"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
              />
            ) : (
              <p className="Items_info">{deathDate}</p>
            )}
          </div>
        )}

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
        {isArtistFocus && (
          <div className="Info_item_line">
            <h2 className="ItemsCard_title">FOCUS: </h2>
            {isModify ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(isFocus)}
                    onChange={(e) => setIsFocus(e.target.checked)}
                  />
                }
              />
            ) : (
              <p className="Items_info">{isFocus ? "OUI" : "NON"}</p>
            )}
          </div>
        )}

        <div className="Info_Btn-Modify">
          {isModify ? (
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
