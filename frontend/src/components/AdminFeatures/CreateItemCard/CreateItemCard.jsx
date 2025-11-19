/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
import "./createItemCard.css";

function CreateItemCard({ origin, onUpdate, closeModal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  // Fonctions pour filtrer les caractères interdits
  const regexInput = (value) => {
    if (!value) return "";

    // Remplacer / et \ par un tiret, et , par un espace
    let cleaned = value.replace(/[\\/]/g, "-").replace(/,/g, " ");

    // Mettre la première lettre en majuscule
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

    return cleaned;
  };

  const handleNameChange = (e) => {
    const regexValue = regexInput(e.target.value);
    setName(regexValue);
  };
  // end Fonctions pour filtrer les caractères interdits

  // Fetch catégories (origin === "focus")
  useEffect(() => {
    if (origin === "focus") {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/focuscategory`)
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error("Error fetching categories:", err));
    }
  }, []);
  // End Fetch catégories (origin === "focus")

  const handleValidate = async () => {
    // Sécurité : si aucun catégorie n'est choisi dans focus
    if (origin === "focus" && !categoryId) {
      toast.error("Merci de choisir une catégorie pour ce focus.", {
        className: "custom-toast",
      });
      return; // On bloque la validation
    }

    try {
      const data = {
        name,
      };

      if (origin === "focus") {
        data.categoryId = categoryId;
      }

      console.info(
        "POST in CeateItemCard:",
        `${import.meta.env.VITE_BACKEND_URL}/api/${origin}`
      );

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

      onUpdate(name);
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
          onChange={handleNameChange}
          className="created-item_input"
        />
      </div>
      {origin === "focus" && (
        <div className="Created_Info_item_line">
          <FormControl fullWidth size="small">
            <InputLabel id="focus-category-label">Category</InputLabel>

            <Select
              labelId="focus-category-label"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              input={<OutlinedInput label="Category" />}
              sx={{
                backgroundColor: "white",
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
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
