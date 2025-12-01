/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";

function CountryDropdown({
  onCountryChange,
  selectedCountryData,
  search,
  handleUpdateMovie,
  handleDeleteMovie,
}) {
  const [countries, setCountries] = useState([]);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth <= 1279 && window.innerWidth >= 769
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsTablet(width <= 1279 && width >= 769);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Fetch des pays ---
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/country`)
      .then((res) => res.json())
      .then(setCountries)
      .catch((err) => console.error("Erreur fetch countries:", err));
  }, [search, handleUpdateMovie, handleDeleteMovie]);

  const handleChange = (event) => {
    onCountryChange(event.target.value);
  };

  return (
    <Select
      value={selectedCountryData}
      onChange={handleChange}
      displayEmpty
      sx={{
        height: "50px",
        textAlign: "center",
        fontFamily: "var(--font-02)",
        color: "var(--color-02)",
        backgroundColor: "var(--color-04)",
        border: "1px solid white",
        width: "30%",
        fontSize: "medium",
        fontWeight: "bold",
        borderRadius: "10px",
        cursor: "pointer",
        "& .MuiSelect-select": {
          paddingY: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        "& .MuiSelect-icon": { color: "var(--color-02)" },
        "& fieldset": { border: "none" },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: "var(--color-04)",
            color: "var(--color-01)",
            fontFamily: "var(--font-02)",
            border: "1px solid white",
            "& .MuiMenuItem-root": {
              justifyContent: "center", // 🔹 centre le texte horizontalement
              textAlign: "center", // 🔹 assure le centrage du texte
            },
          },
        },
      }}
    >
      <MenuItem value="">
        {isTablet ? <PublicIcon sx={{ fontSize: 18, mr: 1 }} /> : "PAYS"}
      </MenuItem>

      {countries.map((country) => (
        <MenuItem key={country.id} value={country.name}>
          {country.name}
        </MenuItem>
      ))}
    </Select>
  );
}

export default CountryDropdown;
