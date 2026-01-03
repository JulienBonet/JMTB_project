/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [authReady, setAuthReady] = useState(false);

  const isAuthenticated = !!token;
  const isAdmin = user?.isAdmin === 1 || user?.isAdmin === true;

  // -------------------------------------------------------
  // LOGIN
  // -------------------------------------------------------
  const login = async (name, password) => {
    const response = await axios.post("/api/auth/login", { name, password });

    const receivedToken = response.data.token;

    // Décoder le token pour récupérer infos utilisateur
    const payload = JSON.parse(atob(receivedToken.split(".")[1]));

    const userData = {
      id: payload.id,
      name: payload.name,
      isAdmin: payload.isAdmin,
    };

    // Stockage
    localStorage.setItem("token", receivedToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(receivedToken);
    setUser(userData);
  };

  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // -------------------------------------------------------
  // Axios Interceptor : ajoute le token automatiquement
  // -------------------------------------------------------
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  useEffect(() => {
    setAuthReady(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAdmin,
        authReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
