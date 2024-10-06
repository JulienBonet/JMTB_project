/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ModeIcon from "@mui/icons-material/Mode";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
import "./adminItemsCard.css";

function AdminItemsCard2({ item, origin, onUpdate, closeModal }) {
  const [isModify, setIsModify] = useState(false);
  const [name, setName] = useState(item.name);
  const [isEditing, setIsEditing] = useState(false);

  const openModif = () => {
    setIsModify(true);
    setIsEditing(true);
  };

  const handleReturn = () => {
    closeModal();
  };

  const handleValidate = async () => {
    try {
      const hasChanges = name !== item.name;

      if (hasChanges) {
        const data = {
          name,
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

      // 3. Réinitialiser les états locaux
      toast.success(`${origin} successfully updated`, {
        className: "custom-toast",
      });
      setIsModify(false);
      setIsEditing(false);
      onUpdate();
      closeModal();
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  const handleUndo = () => {
    setIsModify(false);
    setIsEditing(false);
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
    </article>
  );
}

export default AdminItemsCard2;
