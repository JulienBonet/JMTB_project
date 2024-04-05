/* eslint-disable react/prop-types */
import { useState } from "react";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
import "./createItemCard.css";

function CreateItemCard({ origin, onUpdate, closeModal }) {
  const [name, setName] = useState("");

  const handleValidate = async () => {
    try {
      const data = {
        name,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/${origin}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        console.error("Error creating item");
        // Gestion de la réponse non réussie ici
        // Vous pouvez afficher un message d'erreur à l'utilisateur ou prendre une autre action appropriée
        // Par exemple, si la réponse est un code 400 (Bad Request), vous pouvez extraire le message d'erreur du serveur et l'afficher
        const errorMessage = await response.text();
        console.error("Server error message:", errorMessage);
        return;
      }

      console.info("Item successfully created");
      onUpdate();
      closeModal();
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  const handleUndo = () => {
    closeModal();
  };

  return (
    <article className="Created_ItemsCard">
      <div className="Info_item_line">
        <h1 className="ItemsCard_title"> NEW {origin.toUpperCase()} </h1>
      </div>
      <div className="Info_item_line">
        <h2 className="ItemsCard_title">NAME: </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="Info_Btn-Modify">
        <section className="Item_Editing_Buttons">
          <DoneOutlineIcon
            className="Item_validateButton"
            onClick={handleValidate}
          />
          <UndoIcon className="Item_UndoButton" onClick={handleUndo} />
        </section>
      </div>
    </article>
  );
}

export default CreateItemCard;
