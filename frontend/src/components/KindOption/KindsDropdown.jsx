/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./kindsDropdown.css";

function KindsDropdown({ onKindChange, selectedKindData, search }) {
  const [kinds, setKinds] = useState([]);

  // REQUEST ALL KINDS
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
  }, [search]);

  const handleChange = (event) => {
    const selectedKindId = event.target.value;
    onKindChange(selectedKindId);
  };

  const options = kinds.map((kind) => (
    <option key={kind.id} value={kind.name}>
      {kind.name}
    </option>
  ));

  return (
    <select
      onChange={handleChange}
      className="kindsDropdown"
      value={selectedKindData}
    >
      <option value="">par genre</option>
      {options}
    </select>
  );
}

export default KindsDropdown;
