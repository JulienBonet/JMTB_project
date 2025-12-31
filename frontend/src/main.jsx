/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./Context/AuthContext.jsx";
import RequireAuth from "./Context/RequireAuth.jsx";
import RequireAdmin from "./Context/RequireAdmin.jsx";
import App from "./App.jsx";
import Login from "./pages/Login/Login.jsx";
import Home from "./pages/Home/Home.jsx";
import MovieSearch from "./pages/MovieSearch/MovieSearch.jsx";
import MovieDirectors from "./pages/MovieArtist/MovieDirectors.jsx";
import MovieCasting from "./pages/MovieArtist/MovieCasting.jsx";
import MovieScreenwriters from "./pages/MovieArtist/MovieScreenwriters.jsx";
import MovieMusic from "./pages/MovieArtist/MovieMusic.jsx";
import MovieStudio from "./pages/MovieArtist/Moviestudio.jsx";
import MovieTag from "./pages/MovieArtist/MovieTags.jsx";
import AdminFeat from "./pages/AdminFeat/AdminFeat.jsx";
import AddNewMovie from "./components/AdminFeatures/AddNewMovie/AddNewMovie.jsx";
import MovieInfosEntrance from "./components/AdminFeatures/AddNewMovie/MovieInfosEntrance.jsx";
import MovieThema from "./pages/MovieFocus/MovieThema.jsx";
import MovieFestival from "./pages/MovieFocus/MovieFestival.jsx";
import MovieFocusDirectors from "./pages/MovieFocus/MovieFocusDirectors.jsx";
import MovieFocusCasting from "./pages/MovieFocus/MovieFocusCasting.jsx";
import MovieFavorite from "./pages/MovieFocus/MovieFavorite.jsx";

// Déterminer si on est en mode développement
const isDevelopment = import.meta.env.MODE === "development";

// Configurer l'URL de votre backend en fonction de l'environnement
const backendUrl = isDevelopment
  ? "http://localhost:3310"
  : "https://jmtbproject-production.up.railway.app";

const router = createBrowserRouter([
  // ----------------
  // Routes publiques
  // ----------------
  { path: "/login", element: <Login /> },

  // ----------------
  // Routes nécessitant d'être connecté
  // ----------------
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            index: true, // "/" par défaut -> Home
            element: <Home />,
            loader: async () => {
              try {
                const response = await fetch(
                  `${backendUrl}/api/movies/sorted/nox`
                );
                if (!response.ok) {
                  const text = await response.text();
                  console.error("Response text: ", text);
                  throw new Error("Network response was not ok");
                }
                return await response.json();
              } catch (error) {
                console.error("Fetch error: ", error);
                throw error;
              }
            },
          },
          { path: "movie_search", element: <MovieSearch /> },
          {
            path: "movie_directors",
            element: <MovieDirectors />,
            loader: () => fetch(`${backendUrl}/api/directors`),
          },
          {
            path: "movie_casting",
            element: <MovieCasting />,
            loader: () => fetch(`${backendUrl}/api/casting`),
          },
          {
            path: "movie_screenwriters",
            element: <MovieScreenwriters />,
            loader: () => fetch(`${backendUrl}/api/screenwriters`),
          },
          {
            path: "movie_music",
            element: <MovieMusic />,
            loader: () => fetch(`${backendUrl}/api/music`),
          },
          {
            path: "movie_studio",
            element: <MovieStudio />,
            loader: () => fetch(`${backendUrl}/api/studio`),
          },
          {
            path: "movie_tag",
            element: <MovieTag />,
            loader: () => fetch(`${backendUrl}/api/tags`),
          },
          {
            path: "movie_thema",
            element: <MovieThema />,
            loader: () => fetch(`${backendUrl}/api/focus/1`),
          },
          {
            path: "movie_thema_festival",
            element: <MovieFestival />,
            loader: () => fetch(`${backendUrl}/api/focus/2`),
          },
          {
            path: "movie_thema_directors",
            element: <MovieFocusDirectors />,
            loader: () => fetch(`${backendUrl}/api/directors/focus/random`),
          },
          {
            path: "movie_thema_casting",
            element: <MovieFocusCasting />,
            loader: () => fetch(`${backendUrl}/api/casting/focus/random`),
          },
          {
            path: "movie_favorites",
            element: <MovieFavorite />,
          },

          // ----------------
          // Routes admin uniquement
          // ----------------
          {
            element: <RequireAdmin />,
            children: [
              { path: "admin_feat", element: <AdminFeat /> },
              { path: "new_movie", element: <AddNewMovie /> },
              { path: "movie_entrance", element: <MovieInfosEntrance /> },
            ],
          },
        ],
      },
    ],
  },
]);

// Utiliser createRoot pour rendre l'application complète
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  </React.StrictMode>
);
