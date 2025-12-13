/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import "../../../assets/css/reactQuill_html_parametrage.css";
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
import "./adminItemsCardMediaQueries.css";

function AdminItemsCard({ item, origin, onUpdate, closeModal }) {
  const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  // Fonction Cloudinary
  const getImageUrl = (publicId) => {
    if (!publicId) return "00_jmtb_item_default.jpg";
    return `${CLOUDINARY_BASE_URL}/${publicId}`;
  };

  const [isModify, setIsModify] = useState(false);
  const [name, setName] = useState(item.name || "");
  const [pitch, setPitch] = useState(item.pitch || "");
  const [wikilink, setWikilink] = useState(item.wikilink || "");
  const [imdblink, setImdblink] = useState(item.imdblink || "");
  const [senscritiquelink, setSenscritiquelink] = useState(
    item.senscritiquelink || ""
  );
  const [websitelink, setWebsitelink] = useState(item.webSitelink || "");
  const [birthDate, setBirthDate] = useState(item.birthDate || "");
  const [deathDate, setDeathDate] = useState(item.deathDate || "");
  const [isFocus, setIsFocus] = useState(item.isFocus || "");
  const [image, setImage] = useState(getImageUrl(item.image));
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
    const file = fileInputRef.current.files[0];
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/${origin}/${item.id}/image`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur Cloudinary :", data);
      throw new Error(data.message || "Upload failed");
    }

    return data.url;
  };

  const handleValidate = async () => {
    try {
      const hasChanges =
        name !== item.name ||
        (isArtistFocus && pitch !== item.pitch) ||
        (isArtistFocus && wikilink !== item.wikilink) ||
        (isArtistFocus && imdblink !== item.imdblink) ||
        (isArtistFocus && senscritiquelink !== item.senscritiquelink) ||
        (isArtistFocus && websitelink !== item.websitelink) ||
        (isArtistFocus && birthDate !== item.birthDate) ||
        (isArtistFocus && deathDate !== item.deathDate) ||
        (isArtistFocus && isFocus !== item.isFocus);

      if (hasChanges) {
        const data = { name };

        if (isArtistFocus) {
          data.pitch = pitch || null;
          data.wikilink = wikilink || null;
          data.imdblink = imdblink || null;
          data.senscritiquelink = senscritiquelink || null;
          data.websitelink = websitelink || null;
          data.birthDate = birthDate || null;
          data.deathDate = deathDate || null;
          data.isFocus = Boolean(isFocus);
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/${origin}/${item.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Update failed");
        }
      }

      // UPLOAD IMAGE CLOUDINARY

      let newImageUrl = image;

      if (fileInputRef.current.files[0]) {
        newImageUrl = await handleUpdateImage();
        setImage(newImageUrl);
      }

      toast.success(`${origin} successfully updated`, {
        className: "custom-toast",
      });

      setIsModify(false);
      setShowUploadButton(true);

      onUpdate();
      closeModal();
    } catch (err) {
      toast.error(`Erreur : ${err.message}`, { className: "custom-toast" });
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
    setImage(getImageUrl(item.image));
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
    setImage(getImageUrl(item.image));
    setShowUploadButton(true);
  };

  // -------------------------------
  // HTML MODULE -- ReactQuill
  // -------------------------------
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const formats = ["header", "bold", "italic", "underline", "list", "bullet"];

  return (
    <article className="ItemsCard">
      <section className="ItemsCard_Col_0">
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
        <div className="ItemsCard_bar" />
      </section>

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
          <>
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
            <div className="Info_item_line_html">
              <h2 className="ItemsCard_title">PITCH: </h2>
              {isModify ? (
                <ReactQuill
                  value={pitch}
                  onChange={setPitch}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  style={{
                    width: "91%",
                    // minHeight: "200px",
                  }}
                  className="Items_info"
                />
              ) : (
                <div
                  className="Items_info_artistFocus"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(pitch),
                  }}
                />
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
                <p className="Items_info word-break">{wikilink}</p>
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
                <p className="Items_info word-break">{imdblink}</p>
              )}
            </div>
            <div className="Info_item_line">
              <h2 className="ItemsCard_title">SENS CRITIQUE: </h2>
              {isModify ? (
                <input
                  type="text"
                  value={senscritiquelink}
                  onChange={(e) => setSenscritiquelink(e.target.value)}
                />
              ) : (
                <p className="Items_info word-break">{senscritiquelink}</p>
              )}
            </div>
            <div className="Info_item_line">
              <h2 className="ItemsCard_title">WEBSITE: </h2>
              {isModify ? (
                <input
                  type="text"
                  value={websitelink}
                  onChange={(e) => setWebsitelink(e.target.value)}
                />
              ) : (
                <p className="Items_info word-break">{websitelink}</p>
              )}
            </div>
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
          </>
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
