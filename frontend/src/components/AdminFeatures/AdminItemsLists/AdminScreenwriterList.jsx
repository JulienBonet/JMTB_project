/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import "./adminLists.css";
import PreviewIcon from "@mui/icons-material/Preview";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";

function AdminScreenwriterList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter(
    (itemData) =>
      itemData.name &&
      itemData.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="AdminItemsSection">
      <section>
        <h1 className="admin_Title_feat">SCREENWRITERS LIST</h1>
        <div className="admin_feat_tools_line">
          <div className="search_bar_container">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search_bar"
              placeholder="recherche"
            />
          </div>
          <Button
            variant="contained"
            onClick={() => console.info("Ajouter un scénariste")}
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
            filteredData.map((DataItem) => (
              <tr key={DataItem.id}>
                <th scope="row">{DataItem.id}</th>
                <td>{DataItem.name}</td>
                <td>
                  <PreviewIcon
                    className="admin_tools_ico"
                    // onClick={() => openModal(movieData)}
                  />
                </td>
                <td>
                  <ModeIcon className="admin_tools_ico" />
                </td>
                <td>
                  <DeleteIcon className="admin_tools_ico" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default AdminScreenwriterList;
