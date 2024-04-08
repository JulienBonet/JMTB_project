/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./countryDropdown.css";

function CountryDropdown({ onCountryChange, selectedCountryData, search }) {
  const [countries, setCountries] = useState([]);

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
      <option value="">PAYS</option>
      {options}
    </select>
  );
}

export default CountryDropdown;
