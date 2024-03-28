/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import "./adminLists.css";
import PreviewIcon from "@mui/icons-material/Preview";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";

function AdminLanguagesList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // REQUEST ALL LANGUAGES sorted ID desc
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/languages/sorted_id`)
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
      itemData.language &&
      itemData.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="AdminItemsSection">
      <section>
        <h1 className="admin_Title_feat">LANGUAGE LIST</h1>
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
            onClick={() => console.info("Ajouter une language")}
          >
            ADD NEW LANGUAGE
          </Button>
        </div>
      </section>
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">LANGUAGE</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <div className="LoaderTemp">LOADING...</div>
          ) : (
            filteredData.map((DataItem) => (
              <tr key={DataItem.id}>
                <th scope="row">{DataItem.id}</th>
                <td>{DataItem.language}</td>
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

export default AdminLanguagesList;
