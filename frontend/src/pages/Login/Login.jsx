/* eslint-disable no-restricted-syntax */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import "../../assets/css/common_elements.css";
import "./login.css";
import { useAuth } from "../../Context/AuthContext";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ---------
  // SUBMIT
  // ---------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(name, password);
      console.log("Connexion réussie !");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };
  // ---------
  // SX
  // ---------
  const textFieldSx = {
    backgroundColor: "white",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "var(--color-04)", // bord normal
      },
      "&:hover fieldset": {
        borderColor: "var(--color-02)", // bord hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--color-02)", // bord focus
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--color-05)", // label focus
    },
  };

  const SubmitButtonSx = {
    width: "50%",
    backgroundColor: "var(--color-03)",
    color: "var(--color-04)",
    "&:hover": { backgroundColor: "var(--color-02)", color: "var(--color-05)" },
  };

  // ---------
  // RETURN
  // ---------
  return (
    <main className="main_login_page">
      <section className="content_login_page">
        <h1 className="title_login_page">CONNEXION</h1>

        <form className="form_login" onSubmit={handleSubmit}>
          <div className="textfeild_container_login">
            <TextField
              required
              variant="outlined"
              label="Login"
              sx={textFieldSx}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              required
              variant="outlined"
              label="Password"
              type="password"
              sx={textFieldSx}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error_message">{error}</p>}
          </div>
          <div className="Button_Container_Login_Page">
            {loading ? (
              <CircularProgress size={32} />
            ) : (
              <Button variant="contained" type="submit" sx={SubmitButtonSx}>
                Se connecter
              </Button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;
