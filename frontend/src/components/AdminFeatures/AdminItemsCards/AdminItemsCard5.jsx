/* eslint-disable react/prop-types */
/* eslint-disable no-alert */
import { useState } from "react";
import { toast } from "react-toastify";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
import "./adminItemsCard.css";

function AdminItemsCard5({ item, onUpdate, closeModal }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUndo = () => {
    setNewPassword("");
    setConfirmNewPassword("");
    closeModal();
  };

  const handleValidate = async () => {
    // validations simples
    if (!newPassword || !confirmNewPassword) {
      toast.error("Merci de renseigner les deux champs", {
        className: "custom-toast",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Les mots de passe ne correspondent pas", {
        className: "custom-toast",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères", {
        className: "custom-toast",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user/${item.id}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!response.ok) {
        const txt = await response.text().catch(() => null);
        console.error("Error change password:", txt || response.statusText);
        toast.error(txt || "Erreur lors du changement de mot de passe");
        setIsSubmitting(false);
        return;
      }

      toast.success("Mot de passe mis à jour", { className: "custom-toast" });
      setIsSubmitting(false);
      onUpdate(); // refresh parent
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau");
      setIsSubmitting(false);
    }
  };

  return (
    <article className="ItemsCard">
      <section className="ItemsCard_Col1">
        <div className="Info_item_line">
          <h2 className="ItemsCard_title">ID:</h2>
          <p className="Items_info">{item.id}</p>
        </div>

        <div className="Info_item_line">
          <h2 className="ItemsCard_title">NAME:</h2>
          <p className="Items_info">{item.name}</p>
        </div>

        <div className="Info_item_line">
          <h2 className="ItemsCard_title">NEW PASSWORD:</h2>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="Items_input"
          />
        </div>

        <div className="Info_item_line">
          <h2 className="ItemsCard_title">CONFIRM PASSWORD:</h2>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="Items_input"
          />
        </div>

        <div className="Info_Btn-Modify">
          <section className="Item_Editing_Buttons">
            <DoneOutlineIcon
              className="Item_validateButton"
              onClick={handleValidate}
              style={{
                opacity: isSubmitting ? 0.6 : 1,
                pointerEvents: isSubmitting ? "none" : "auto",
              }}
            />
            <UndoIcon className="Item_UndoButton" onClick={handleUndo} />
          </section>
        </div>
      </section>
    </article>
  );
}

export default AdminItemsCard5;
