/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./alphabetDropdown.css";

// Génère A-Z
function generateAlphabet() {
  const alphabet = [];
  for (let i = 0; i < 26; i++) {
    alphabet.push(String.fromCharCode(65 + i));
  }
  return alphabet;
}

// Génère 0-9
function generateNumbers() {
  const numbers = [];
  for (let i = 0; i <= 9; i++) {
    numbers.push(i.toString());
  }
  return numbers;
}

function AlphabetDropdown({
  onLetterChange,
  origin,
  AlphabetDropdownClassName,
  search,
}) {
  const [options, setOptions] = useState([]);

  const handleChange = (event) => {
    onLetterChange(event.target.value);
  };

  useEffect(() => {
    const letters = generateAlphabet();
    const numbers = generateNumbers();

    // Si origin === "tag", on ajoute les chiffres
    const allOptions = origin === "tags" ? [...numbers, ...letters] : letters;

    const generatedOptions = allOptions.map((char) => (
      <option key={char} value={char}>
        {char}
      </option>
    ));

    setOptions(generatedOptions);
  }, [search, origin]);

  return (
    <select
      onChange={handleChange}
      className={
        AlphabetDropdownClassName === "artistlist"
          ? "AlphabetDropdown"
          : "AlphabetDropdown2"
      }
    >
      {search !== "" && <option value="">-</option>}
      {options}
    </select>
  );
}

export default AlphabetDropdown;
