/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from "react";
import { Button, Container } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import "./adminLists.css";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AdminItemsCard from "../AdminItemsCards/AdminItemsCard";
import CreateItemCard from "../CreateItemCard/CreateItemCard";

function AdminScreenwriterList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newScreenWriter, setNewScreenWriter] = useState(false);

  const origin = "screenwriter";

  const openModal = (DataItem) => {
    setSelectedItem(DataItem);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const openModalNewScreenWriter = () => {
    setNewScreenWriter(true);
  };

  const closeModalNewScreenWriter = () => {
    setNewScreenWriter(false);
  };

  // REQUEST ALL SCREENWRITERS sorted ID desc
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screenwriters/sorted_id`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((datas) => {
        setData(datas);
        setFilteredData(datas); // Set filtered data initially to all data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  // REFRESH SCREENWRITERS LIST
  const refreshScreenWriter = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screenwriters/sorted_id`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((datas) => {
        setData(datas);
        setFilteredData(datas);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  // DELETE SCREENWRITER
  const handleDelete = async (id) => {
    // Display confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this work?"
    );

    // If user confirms deletion
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/screenwriter/${id}`,
          {
            method: "delete",
          }
        );
        if (response.status === 204) {
          console.info("delete ok");
          toast.success("screenwriter deleted", {
            className: "custom-toast",
          });
          refreshScreenWriter();
        } else {
          console.error("error delete");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // SEARCH BAR
  useEffect(() => {
    const filtered = data.filter(
      (itemData) =>
        itemData.name &&
        itemData.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // PAGINATION
  const artistsPerPage = 50;
  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = filteredData.slice(
    indexOfFirstArtist,
    indexOfLastArtist
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <section className="AdminItemsSection">
      <section className="HeaderAdminItemsSection">
        <div className="admin_Title_feat_container">
          <h1 className="admin_Title_feat">SCREENWRITERS LIST</h1>
        </div>
        <div className="admin_feat_tools_line">
          <div className="Admin_search_bar_container">
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un scénariste..."
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#aaa" }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm("")} size="small">
                      <ClearIcon sx={{ color: "#888" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 300, // ajuste si besoin
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#f5f5f5",
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--color-03)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-03)",
                    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                  },
                },
                input: {
                  color: "#333",
                  "&::placeholder": {
                    color: "#aaa",
                    opacity: 1,
                  },
                },
              }}
            />
          </div>
          <Button
            variant="contained"
            onClick={() => openModalNewScreenWriter()}
          >
            ADD NEW SCREENWRITER
          </Button>
        </div>
      </section>
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">SCREENWRITER</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <div className="LoaderTemp">LOADING...</div>
          ) : (
            currentArtists.map((DataItem) => (
              <tr key={DataItem.id}>
                <th scope="row">{DataItem.id}</th>
                <td data-label="Scénariste">{DataItem.name}</td>
                <td data-label="Aperçu">
                  <PreviewIcon
                    className="admin_tools_ico"
                    onClick={() => openModal(DataItem)}
                  />
                </td>
                <td data-label="Supprimer">
                  <DeleteIcon
                    className="admin_tools_ico"
                    onClick={() => handleDelete(DataItem.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          count={Math.ceil(filteredData.length / artistsPerPage)}
          shape="rounded"
          onChange={handlePageChange}
        />
      </Box>
      {selectedItem && (
        <Modal open onClose={closeModal} className="Movie_Modal">
          <Box>
            <Container maxWidth="lg">
              <div
                onClick={closeModal}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    closeModal();
                  }
                }}
                role="button"
                tabIndex={0}
                className="modal_closed_btn"
              >
                X Fermer
              </div>
              <AdminItemsCard
                item={selectedItem}
                origin={origin}
                onUpdate={refreshScreenWriter}
                closeModal={closeModal}
                showImage
                showPitch
                showWikilink
                showImdbLink
              />
            </Container>
          </Box>
        </Modal>
      )}
      {newScreenWriter && (
        <Modal open onClose={closeModalNewScreenWriter} className="Movie_Modal">
          <Box>
            <Container maxWidth="sm">
              <div
                onClick={closeModalNewScreenWriter}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    closeModalNewScreenWriter();
                  }
                }}
                role="button"
                tabIndex={0}
                className="modal_closed_btn"
              >
                X Fermer
              </div>
              <CreateItemCard
                origin={origin}
                onUpdate={refreshScreenWriter}
                closeModal={closeModalNewScreenWriter}
              />
            </Container>
          </Box>
        </Modal>
      )}
    </section>
  );
}

export default AdminScreenwriterList;
