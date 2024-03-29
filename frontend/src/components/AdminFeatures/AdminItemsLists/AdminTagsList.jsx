/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import "./adminLists.css";
import PreviewIcon from "@mui/icons-material/Preview";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

function AdminTagsList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const filteredData = data.filter(
    (itemData) =>
      itemData.name &&
      itemData.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button
            variant="contained"
            onClick={() => console.info("Ajouter un Tag")}
          >
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
          {currentItems.map((DataItem) => (
            <tr key={DataItem.id}>
              <th scope="row">{DataItem.id}</th>
              <td>{DataItem.name}</td>
              <td>
                <PreviewIcon className="admin_tools_ico" />
              </td>
              <td>
                <ModeIcon className="admin_tools_ico" />
              </td>
              <td>
                <DeleteIcon className="admin_tools_ico" />
              </td>
            </tr>
          ))}
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
    </section>
  );
}

export default AdminTagsList;
