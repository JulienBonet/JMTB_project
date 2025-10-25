/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./countryDropdown.css";

function CountryDropdown({ onCountryChange, selectedCountryData, search }) {
  const [countries, setCountries] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

  // REQUEST ALL COUNTRIES
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/country`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((countryData) => {
        setCountries(countryData);
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
    const selectedCountryId = event.target.value;
    onCountryChange(selectedCountryId);
  };

  const options = countries.map((country) => (
    <option key={country.id} value={country.name}>
      {country.name}
    </option>
  ));

  return (
    <select
      onChange={handleChange}
      className="countryDropdown"
      value={selectedCountryData}
    >
      <option value="">{isMobile ? "🌍" : "PAYS"}</option>
      {options}
    </select>
  );
}

export default CountryDropdown;
