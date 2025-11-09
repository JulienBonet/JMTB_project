/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./kindsDropdown.css";

function KindsDropdown({ onKindChange, selectedKindData, search }) {
  const [kinds, setKinds] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

  //------------------
  // REQUEST ALL KINDS
  //------------------
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/kinds`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((kindsData) => {
        setKinds(kindsData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    // 🔹 Gérer le passage desktop ↔ mobile dynamiquement
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [search]); // end useEffect

  const handleChange = (event) => {
    const selectedKindId = event.target.value;
    onKindChange(selectedKindId);
  };

  // Mapping des genres pour créer les options de sélection
  const options = kinds.map((kind) => (
    <option key={kind.id} value={kind.name}>
      {kind.name}
    </option>
  ));

  //------------------
  // RETURN
  //------------------
  return (
    <select
      onChange={handleChange}
      className="kindsDropdown"
      value={selectedKindData}
    >
      <option value="">{isMobile ? "🎬" : "GENRES"}</option>
      {options}
    </select>
  );
}

export default KindsDropdown;
