/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./alphabetDropdown.css";

// GENERATE ALPHABET
function generateAlphabet() {
  const alphabet = [];
  for (let i = 0; i < 26; i++) {
    alphabet.push(String.fromCharCode(65 + i));
  }
  return alphabet;
}

function AlphabetDropdown({ onLetterChange, origin, search }) {
  const [options, setOptions] = useState([]);
  const letters = generateAlphabet();

  const handleChange = (event) => {
    const selectedLetter = event.target.value;
    onLetterChange(selectedLetter);
  };

  useEffect(() => {
    const generatedOptions = letters.map((letter) => (
      <option key={letter} value={letter}>
        {letter}
      </option>
    ));
    setOptions(generatedOptions);
  }, [search]);

  return (
    <select
      onChange={handleChange}
      className={
        origin === "artistlist" ? "AlphabetDropdown" : "AlphabetDropdown2"
      }
    >
      {search !== "" && <option value="">-</option>}
      {options}
    </select>
  );
}

export default AlphabetDropdown;
