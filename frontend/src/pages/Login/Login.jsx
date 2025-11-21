/* eslint-disable no-restricted-syntax */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../../assets/css/common_elements.css";
import "./login.css";
import { useAuth } from "../../Context/AuthContext";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth(); // hook de ton AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(name, password); // appel au login du contexte
      console.log("Connexion réussie !");

      // redirection après connexion réussie
      navigate("/"); // "/" correspond à Home
    } catch (err) {
      console.error(err);
      setError("Identifiants incorrects");
    }
  };

  return (
    <main className="main_login_page">
      <section className="content_login_page">
        <h1 className="title_login_page">CONNEXION</h1>

        <form className="form_login" onSubmit={handleSubmit}>
          <TextField
            required
            label="Login"
            sx={{ backgroundColor: "white", marginBottom: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            required
            label="Password"
            type="password"
            sx={{ backgroundColor: "white", marginBottom: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error_message">{error}</p>}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: "100%" }}
          >
            Se connecter
          </Button>
        </form>
      </section>
    </main>
  );
}

export default Login;
