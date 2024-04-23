/* eslint-disable no-shadow */
/* eslint-disable no-alert */
import { useState, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TransferList from "./MovieItemList";
import "./addNewMovie.css";

function AddNewMovie() {
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("");
  const [source, SetSource] = useState("MovieDb");
  const [support, setSupport] = useState("");
  const [format, setFormat] = useState("");
  const [fileSize, setFileSize] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(
    "http://localhost:3310/00_cover_default.jpg"
  );
  const [openModal, setOpenModal] = useState(false);
  const [selectedKinds, setSelectedKinds] = useState([]);
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [selectedScreenwriters, setSelectedScreenwriters] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [selectedCasting, setSelectedCasting] = useState([]);
  const [selectedStudios, setSelectedStudios] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // options source
  const handleChangeSource = (event) => {
    SetSource(event.target.value);
  };

  // MODAL ITEMS
  const fetchData = (route) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${route}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((datas) => {
        setData(datas);
      })
      .catch((error) => {
        console.error(`Error fetching ${route}:`, error);
      });
  };

  const handleOpenModal = (type) => {
    setDataType(type);
    setOpenModal(true);
    fetchData(type);
  };

  // const handleOpenModal = (type) => {
  //   setDataType(type);
  //   setOpenModal(true);
  //   if (openModal) {
  //     fetchData(type);
  //   }
  // };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDataType("");
    setData([]);
  };

  const handleSelectedKindsUpdate = (updatedSelectedKinds) => {
    setSelectedKinds(updatedSelectedKinds);
  };

  const handleSelectedDirectorsUpdate = (updatedSelectedDirectors) => {
    setSelectedDirectors(updatedSelectedDirectors);
  };

  const handleSelectedScreenwritersUpdate = (updatedSelectedScreenwriters) => {
    setSelectedScreenwriters(updatedSelectedScreenwriters);
  };

  const handleSelectedMusicUpdate = (updatedSelectedMusic) => {
    setSelectedMusic(updatedSelectedMusic);
  };

  const handleSelectedStudiosUpdate = (updatedSelectedStudios) => {
    setSelectedStudios(updatedSelectedStudios);
  };

  const handleSelectedCastingUpdate = (updatedSelectedCasting) => {
    setSelectedCasting(updatedSelectedCasting);
  };

  const handleSelectedCountriesUpdate = (updatedSelectedCountries) => {
    setSelectedCountries(updatedSelectedCountries);
  };

  const handleSelectedLanguagesUpdate = (updatedSelectedLanguages) => {
    setSelectedLanguages(updatedSelectedLanguages);
  };

  const handleSelectedTagsUpdate = (updatedSelectedTags) => {
    setSelectedTags(updatedSelectedTags);
  };

  // extract names from objects
  const getSelectedKindsNames = (selectedKinds) => {
    return selectedKinds.map((kind) => kind.name).join(", ");
  };

  const getSelectedDirectorsNames = (selectedDirectors) => {
    return selectedDirectors.map((director) => director.name).join(", ");
  };

  const getSelectedScreenwritersNames = (selectedScreenwriters) => {
    return selectedScreenwriters
      .map((screenwriter) => screenwriter.name)
      .join(", ");
  };

  const getSelectedMusicNames = (selectedMusic) => {
    return selectedMusic.map((compositor) => compositor.name).join(", ");
  };

  const getSelectedCastingNames = (selectedCasting) => {
    return selectedCasting.map((casting) => casting.name).join(", ");
  };

  const getSelectedStudiosNames = (selectedStudios) => {
    return selectedStudios.map((studio) => studio.name).join(", ");
  };

  const getSelectedCountriesNames = (selectedCountries) => {
    return selectedCountries.map((country) => country.name).join(", ");
  };

  const getSelectedLanguagesNames = (selectedLanguages) => {
    return selectedLanguages.map((language) => language.name).join(", ");
  };

  const getSelectedTagsNames = (selectedTags) => {
    return selectedTags.map((tag) => tag.name).join(", ");
  };

  // INPUT FILE
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const videoFormats = ["avi", "mkv", "mp4"];

    if (videoFormats.includes(fileExtension)) {
      setSelectedFile(file);
      const fileSizeInBytes = file.size;
      const fileSizeInGigabytes = fileSizeInBytes / (1024 * 1024 * 1024);
      setFileSize(fileSizeInGigabytes.toFixed(2));
      setFileSize(fileSizeInGigabytes.toFixed(2));
      setFormat(fileExtension);
      setSupport("FICHIER MULTIMEDIA");
    } else {
      alert("Veuillez sélectionner un fichier vidéo valide.");
    }
  };

  const supportsHandleChange = (event) => {
    setSupport(event.target.value);
  };

  const formatsHandleChange = (event) => {
    setFormat(event.target.value);
  };

  // INPUT COVER
  const fileCoverRef = useRef(null);

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const imageFormats = ["jpg", "jpeg", "png"];

    if (imageFormats.includes(fileExtension)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Veuillez sélectionner un fichier image valide.");
    }
  };

  // BUTTON STYLE
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1e1612",
      },
      secondary: {
        main: "#00d9c0",
      },
    },
  });

  // MODAL STYLE
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <main>
      <section className="Adm_form_box">
        <section className="Adm_l1">
          <div className="Adm_l1a">
            <h1 className="AdM_main_title">ADD NEW MOVIE</h1>
            {/* movie idTheMovieDb - idImDB */}
            <div className="SourceResearchItems">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    MovieDb / ImDB
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={source}
                    label="MovieDb / ImDB"
                    onChange={handleChangeSource}
                  >
                    <MenuItem value="MovieDb">MovieDb</MenuItem>
                    <MenuItem value="ImDB">ImDB</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "15ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                {source === "MovieDb" && (
                  <TextField
                    id="filled-basic"
                    label="Id MovieDb"
                    variant="outlined"
                  />
                )}
                {source === "ImDB" && (
                  <TextField
                    id="filled-basic"
                    label="Id ImDB"
                    variant="outlined"
                  />
                )}
              </Box>
              <Stack spacing={2} direction="row">
                <Button variant="contained" size="large">
                  RECHERCHE
                </Button>
              </Stack>
            </div>
            {/* movie TITLE */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "150ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField
                id="filled-basic"
                label="Titre du film"
                variant="outlined"
              />
            </Box>
            {/* movie alt TITLE */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "100ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField
                id="filled-basic"
                label="Titre alternatif"
                variant="outlined"
              />
            </Box>
            {/* movie YEAR - DURATION */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "25ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField id="filled-basic" label="Année" variant="outlined" />
              <TextField id="filled-basic" label="Durée" variant="outlined" />
            </Box>
            {/* movie PITCH */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "100ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField id="filled-basic" label="pitch" variant="outlined" />
            </Box>
            {/* movie STORY */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "100ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField
                id="outlined-multiline-static"
                label="story"
                multiline
                rows={4}
                defaultValue=""
              />
            </Box>
            {/* movie TRAILER */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "100ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField id="filled-basic" label="trailer" variant="outlined" />
            </Box>
            {/* movie TAG */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "88ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Tags"
                  value={getSelectedTagsNames(selectedTags)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("tags/sorted_id")}
              />
            </div>
          </div>

          <div className="Adm_l1b">
            {/* movie KINDS */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Genre(s)"
                  value={getSelectedKindsNames(selectedKinds)}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("kinds")}
              />
            </div>
            {/* movie DIRECTOR */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Réalisateur(s)"
                  value={getSelectedDirectorsNames(selectedDirectors)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("directors")}
              />
            </div>
            {/* movie SCREENWRITERS */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Scénariste(s)"
                  value={getSelectedScreenwritersNames(selectedScreenwriters)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("screenwriters")}
              />
            </div>
            {/* movie COMPOSITOR */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Compositeur(s)"
                  value={getSelectedMusicNames(selectedMusic)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("music")}
              />
            </div>
            {/* movie CASTING */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Casting"
                  value={getSelectedCastingNames(selectedCasting)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("casting")}
              />
            </div>
            {/* movie STUDIO */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Studio"
                  value={getSelectedStudiosNames(selectedStudios)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("studio")}
              />
            </div>
            {/* movie COUNTRY */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Pays"
                  value={getSelectedCountriesNames(selectedCountries)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("country")}
              />
            </div>
            {/* movie LANGUAGES */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Langues"
                  value={getSelectedLanguagesNames(selectedLanguages)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("languages/sorted_id")}
              />
            </div>
          </div>
        </section>
        <div className="dashed_secondary_bar" />

        <section className="Adm_l2">
          <div className="Adm_l2a">
            {/* movie SUPPORT */}
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-select-small-label">Support</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={support}
                label="Support"
                onChange={supportsHandleChange}
              >
                <MenuItem value="">
                  <em>choisir un support</em>
                </MenuItem>
                <MenuItem value="DVD R/RW">DVD</MenuItem>
                <MenuItem value="DVD R/RW">DVD R/RW</MenuItem>
                <MenuItem value="FICHIER MULTIMEDIA">
                  FICHIER MULTIMEDIA
                </MenuItem>
              </Select>
            </FormControl>
            <div>
              {/* movie VIDEOFORMAT */}
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "25ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
              >
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-select-small-label">format</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={format}
                    label="Support"
                    onChange={formatsHandleChange}
                  >
                    <MenuItem value="">
                      <em>choisir un format</em>
                    </MenuItem>
                    <MenuItem value="avi">avi</MenuItem>
                    <MenuItem value="mkv">mkv</MenuItem>
                    <MenuItem value="mp4">mp4</MenuItem>
                  </Select>
                </FormControl>
                {/* movie FILESIZE */}
                <TextField
                  label="fileSize"
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Go</InputAdornment>
                    ),
                    value: fileSize,
                  }}
                />
              </Box>
            </div>
            {/* movie LOCAL FILE */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "75ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={1}
            >
              <TextField
                id="filled-basic"
                label="fichier Local"
                variant="outlined"
                value={selectedFile ? selectedFile.name : ""}
              />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <button
                type="button"
                className="input_file_btn"
                onClick={() => fileInputRef.current.click()}
              >
                Sélectionner un fichier vidéo
              </button>
            </Box>
          </div>
          {/* movie COVER */}
          <div className="Adm_l2b">
            <img
              className="preview_cover"
              src={coverPreview}
              alt="Couverture"
            />
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleCoverChange}
              ref={fileCoverRef}
              accept="image/*"
            />
            <button type="button" onClick={() => fileCoverRef.current.click()}>
              Sélectionner une image
            </button>
          </div>
        </section>

        <div className="dashed_secondary_bar" />
        <section className="Adm_l3">
          {/* VALIDATION */}
          <ThemeProvider theme={theme}>
            <Stack spacing={2} direction="row">
              <Button size="large" variant="outlined" color="primary">
                VALIDER
              </Button>
            </Stack>
          </ThemeProvider>
        </section>
      </section>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TransferList
            dataType={dataType}
            items={data}
            selectedKinds={selectedKinds}
            onSelectedKindsUpdate={handleSelectedKindsUpdate}
            selectedDirectors={selectedDirectors}
            onSelectedDirectorsUpdate={handleSelectedDirectorsUpdate}
            selectedScreenwriters={selectedScreenwriters}
            onSelectedScreenwritersUpdate={handleSelectedScreenwritersUpdate}
            selectedMusic={selectedMusic}
            onSelectedMusicUpdate={handleSelectedMusicUpdate}
            selectedCasting={selectedCasting}
            onSelectedCastingUpdate={handleSelectedCastingUpdate}
            selectedStudios={selectedStudios}
            onSelectedStudiosUpdate={handleSelectedStudiosUpdate}
            selectedCountries={selectedCountries}
            onSelectedCountriesUpdate={handleSelectedCountriesUpdate}
            selectedLanguages={selectedLanguages}
            onSelectedLanguagesUpdate={handleSelectedLanguagesUpdate}
            selectedTags={selectedTags}
            onSelectedTagsUpdate={handleSelectedTagsUpdate}
          />
        </Box>
      </Modal>
    </main>
  );
}

export default AddNewMovie;
