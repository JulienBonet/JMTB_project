/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import "./alphabetDropdown.css";

// GENERATE ALPHABET
function generateAlphabet() {
  const alphabet = [];
  for (let i = 0; i < 26; i++) {
    alphabet.push(String.fromCharCode(65 + i));
  }
  return alphabet;
}

function AlphabetDropdown({ onLetterChange }) {
  const letters = generateAlphabet();

  const handleChange = (event) => {
    const selectedLetter = event.target.value;
    onLetterChange(selectedLetter);
  };

  const options = letters.map((letter) => (
    <option key={letter} value={letter}>
      {letter}
    </option>
  ));

  return <select onChange={handleChange}>{options}</select>;
}

export default AlphabetDropdown;
