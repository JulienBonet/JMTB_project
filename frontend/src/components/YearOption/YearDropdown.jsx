/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";

function YearDropdown({ onYearChange, selectedYearData, search }) {
  const [decades, setDecades] = useState([]);
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

  //------------------
  // REQUEST ALL YEARS / DECADES
  //------------------
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/decades`)
      .then((res) => res.json())
      .then(setDecades)
      .catch((err) => console.error("Error fetching decades:", err));

    // const handleResize = () => setIsMobile(window.innerWidth <= 1279);
    // window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
  }, [search]);

  const handleChange = (event) => {
    onYearChange(event.target.value);
  };

  //------------------
  // RETURN
  //------------------
  return (
    <Select
      value={selectedYearData}
      onChange={handleChange}
      displayEmpty
      sx={{
        height: "40px",
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
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            },
            "& .MuiMenuItem-root:hover": {
              backgroundColor: "#ffa500",
              color: "#242105",
            },
          },
        },
      }}
    >
      {/* Placeholder / icône mobile */}
      <MenuItem value="">
        {isTablet ? (
          <CalendarMonthTwoToneIcon sx={{ fontSize: 20, mr: 1 }} />
        ) : (
          "PERIODE"
        )}
      </MenuItem>

      {decades.map((decade) => (
        <MenuItem key={decade.decade} value={decade.decade}>
          Années {decade.decade}
        </MenuItem>
      ))}
    </Select>
  );
}

export default YearDropdown;
