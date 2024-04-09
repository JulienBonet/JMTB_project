/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        const errorMessage = await response.text();
        console.error("Server error message:", errorMessage);
        return;
      }

      console.info("Item successfully created");
      toast.success(`${origin} successfully created`, {
        className: "custom-toast",
      });
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
      <div className="Created_Info_item_line">
        <h1 className="Created_ItemsCard_Big_title">
          {" "}
          NEW {origin.toUpperCase()}{" "}
        </h1>
      </div>
      <div className="Created_Info_item_line">
        <h2 className="Created_ItemsCard_title">ENTER NAME: </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="created-item_input"
        />
      </div>
      <div className="Created_Info_Btn-Modify">
        <section className="Created_Item_Editing_Buttons">
          <DoneOutlineIcon
            className="Created_Item_validateButton"
            onClick={handleValidate}
          />
          <UndoIcon className="Created_Item_UndoButton" onClick={handleUndo} />
        </section>
      </div>
    </article>
  );
}

export default CreateItemCard;
