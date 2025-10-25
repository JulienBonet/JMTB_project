/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./yearDropdown.css";

function YearDropdown({ onYearChange, selectedYearData, search }) {
  const [decades, setDecades] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

  // REQUEST ALL YEAR
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/decades`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((decadesData) => {
        setDecades(decadesData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    // 🔹 Gérer le passage desktop ↔ mobile dynamiquement
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [search]);

  const handleChange = (event) => {
    const selectedDecade = event.target.value;
    onYearChange(selectedDecade);
  };

  // Mapping des années pour créer les options de sélection
  const options = decades.map((decade) => (
    <option key={decade.decade} value={decade.decade}>
      Années {decade.decade}
    </option>
  ));

  return (
    <select
      onChange={handleChange}
      className="YearsDropdown"
      value={selectedYearData}
    >
      <option value="">{isMobile ? "📅" : "PERIODE"}</option>
      {options}
    </select>
  );
}

export default YearDropdown;
