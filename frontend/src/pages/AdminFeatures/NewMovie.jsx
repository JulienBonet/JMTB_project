import { useState, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./newMovie.css";

function NewMovie() {
  const [support, setSupport] = useState("");
  const [format, setFormat] = useState("");
  const [fileSize, setFileSize] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // SUPPORT - FORMAT - LOCATION
  const supportsHandleChange = (event) => {
    setSupport(event.target.value);
  };

  const formatsHandleChange = (event) => {
    setFormat(event.target.value);
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const fileSizeInBytes = file.size;
    const fileSizeInGigabytes = fileSizeInBytes / (1024 * 1024 * 1024);
    setFileSize(fileSizeInGigabytes.toFixed(2)); // Arrondir à 2 décimales
    const fileNameParts = file.name.split(".");
    const fileExtension = fileNameParts[fileNameParts.length - 1];
    setFormat(fileExtension); // Obtenir l'extension du fichier
    setSupport("FICHIER MULTIMEDIA");
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

  return (
    <main>
      <section className="AdM_title_position">
        <h1 className="AdM_main_title">+ add new movie ...</h1>
      </section>
      <div className="dashed_secondary_bar" />
      <section className="Adm_form_box">
        <section className="Adm_l1">
          <div className="Adm_l1a">
            {/* movie idTheMovieDb - idImDB */}
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
              <TextField id="filled-basic" label="MovieDb" variant="outlined" />
              <TextField id="filled-basic" label="ImDB" variant="outlined" />
            </Box>
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
                  defaultValue="..."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon />
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
                  defaultValue="..."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon />
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
                  defaultValue="..."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon />
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
                  defaultValue="..."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon />
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
                  defaultValue="..."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon />
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
                  defaultValue="..."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon />
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
                  defaultValue="..."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon />
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
                  defaultValue="..."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon />
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
                  defaultValue="..."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon />
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
                onClick={() => fileInputRef.current.click()}
                style={{ width: "100px" }}
              >
                fichier +
              </button>
            </Box>
          </div>
          <div className="Adm_l2b">
            <div>COVERS MODULE</div>
          </div>
        </section>
        <div className="dashed_secondary_bar" />
        <section className="Adm_l3">
          <ThemeProvider theme={theme}>
            <Stack spacing={2} direction="row">
              <Button size="large" variant="outlined" color="primary">
                VALIDER
              </Button>
            </Stack>
          </ThemeProvider>
        </section>
      </section>
    </main>
  );
}

export default NewMovie;
