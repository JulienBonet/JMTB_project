/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./yearDropdown.css";

function YearDropdown({ onYearChange, selectedYearData, search }) {
  const [years, setYears] = useState([]);

  // REQUEST ALL YEAR
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/years`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((yearsData) => {
        setYears(yearsData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [search]);

  const handleChange = (event) => {
    const selectedYear = event.target.value;
    onYearChange(selectedYear);
  };

  const options = years.map((year) => (
    <option key={year.index} value={year.year}>
      {year.year}
    </option>
  ));

  return (
    <select
      onChange={handleChange}
      className="YearsDropdown"
      value={selectedYearData}
    >
      <option value="">par années</option>
      {options}
    </select>
  );
}

export default YearDropdown;
