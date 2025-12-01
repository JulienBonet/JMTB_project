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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Fonctions pour filtrer les caractères interdits
  const regexInput = (value) => {
    if (!value) return "";

    // Remplacer / et \ par un tiret, et , par un espace
    let cleaned = value.replace(/[\\/]/g, "-").replace(/,/g, " ");

    // Supprimer l'espace au début
    cleaned = cleaned.replace(/^\s+/, "");

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
    // Vérification des champs requis
    if (!name || (origin === "user" && (!password || !confirmPassword))) {
      toast.error("Please fill all required fields", {
        className: "custom-toast",
      });
      return;
    }

    // Vérification correspondance des mots de passe pour les users
    if (origin === "user" && password !== confirmPassword) {
      toast.error("Passwords do not match", { className: "custom-toast" });
      return;
    }

    // Vérification catégorie pour focus
    if (origin === "focus" && !categoryId) {
      toast.error("Merci de choisir une catégorie pour ce focus.", {
        className: "custom-toast",
      });
      return;
    }

    try {
      // Préparer les données à envoyer
      const data = { name };

      if (origin === "user") {
        data.password = password;
        data.isAdmin = isAdmin ? 1 : 0;
      }

      if (origin === "focus") {
        data.categoryId = categoryId;
      }

      // Déterminer l'URL de l'API
      const url =
        origin === "user"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/${origin}` // Auth spécifique pour user
          : `${import.meta.env.VITE_BACKEND_URL}/api/${origin}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            origin === "user"
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage || "Error creating item");
        return;
      }

      toast.success(`${origin.toUpperCase()} successfully created`, {
        className: "custom-toast",
      });

      onUpdate(name);
      closeModal();
    } catch (error) {
      console.error("Request error:", error);
      toast.error("Error creating item");
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
              sx={{ backgroundColor: "white" }}
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
      {origin === "user" && (
        <>
          <div className="Created_Info_item_line">
            <h2 className="Created_ItemsCard_title">ENTER PASSWORD: </h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="created-item_input"
            />
          </div>
          <div className="Created_Info_item_line">
            <h2 className="Created_ItemsCard_title">CONFIRM PASSWORD:</h2>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="created-item_input"
            />
          </div>

          <div className="Created_Info_item_line">
            <h2 className="Created_ItemsCard_title">ROLE: </h2>
            <select
              value={isAdmin ? "admin" : "user"}
              onChange={(e) => setIsAdmin(e.target.value === "admin")}
              className="created-item_select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </>
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
