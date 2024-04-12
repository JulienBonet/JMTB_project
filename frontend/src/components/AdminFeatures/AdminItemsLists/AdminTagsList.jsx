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
import AdminItemsCard from "../AdminItemsCards/AdminItemsCard2";
import CreateItemCard from "../CreateItemCard/CreateItemCard";

function AdminTagsList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newTag, setNewTag] = useState(false);

  const origin = "tag";

  const openModal = (DataItem) => {
    setSelectedItem(DataItem);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const openModalNewTag = () => {
    setNewTag(true);
  };

  const closeModalNewTag = () => {
    setNewTag(false);
  };

  // REQUEST ALL TAGS sorted ID desc
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tags/sorted_id`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((datas) => {
        setData(datas);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  // REFRESH TAGS LIST
  const refreshTag = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tags/sorted_id`)
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

  // DELETE LANGUAGE
  const handleDelete = async (id) => {
    // Display confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this work?"
    );

    // If user confirms deletion
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/tag/${id}`,
          {
            method: "delete",
          }
        );
        if (response.status === 204) {
          console.info("delete ok");
          toast.success("tag deleted", {
            className: "custom-toast",
          });
          refreshTag();
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
  const itemsPerPage = 50;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <section className="AdminItemsSection">
      <section className="HeaderAdminItemsSection">
        <div className="admin_Title_feat_container">
          <h1 className="admin_Title_feat">TAGS LIST</h1>
        </div>
        <div className="admin_feat_tools_line">
          <div className="Admin_search_bar_container">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search_bar"
              placeholder="recherche"
            />
          </div>
          <Button variant="contained" onClick={() => openModalNewTag()}>
            ADD NEW TAG
          </Button>
        </div>
      </section>
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">TAG</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <div className="LoaderTemp">LOADING...</div>
          ) : (
            currentItems.map((DataItem) => (
              <tr key={DataItem.id}>
                <th scope="row">{DataItem.id}</th>
                <td>{DataItem.name}</td>
                <td>
                  <PreviewIcon
                    className="admin_tools_ico"
                    onClick={() => openModal(DataItem)}
                  />
                </td>
                <td>
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
          count={Math.ceil(filteredData.length / itemsPerPage)}
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
                onUpdate={refreshTag}
                closeModal={closeModal}
              />
            </Container>
          </Box>
        </Modal>
      )}
      {newTag && (
        <Modal open onClose={closeModalNewTag} className="Movie_Modal">
          <Box>
            <Container maxWidth="sm">
              <div
                onClick={closeModalNewTag}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    closeModalNewTag();
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
                onUpdate={refreshTag}
                closeModal={closeModalNewTag}
              />
            </Container>
          </Box>
        </Modal>
      )}
    </section>
  );
}

export default AdminTagsList;
