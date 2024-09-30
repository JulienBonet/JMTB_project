/* eslint-disable import/extensions */
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import Home from "./pages/Home/Home.jsx";
import MovieSearch from "./pages/MovieSearch/MovieSearch.jsx";
import MovieDirectors from "./pages/MovieArtist/MovieDirectors.jsx";
import MovieCasting from "./pages/MovieArtist/MovieCasting.jsx";
import MovieScreenwriters from "./pages/MovieArtist/MovieScreenwriters.jsx";
import MovieMusic from "./pages/MovieArtist/MovieMusic.jsx";
import MovieStudio from "./pages/MovieArtist/Moviestudio.jsx";
import AdminFeat from "./pages/AdminFeat/AdminFeat.jsx";
import AddNewMovie from "./components/AdminFeatures/AddNewMovie/AddNewMovie.jsx";
import MovieInfosEntrance from "./components/AdminFeatures/AddNewMovie/MovieInfosEntrance.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: async () => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/nox`
            );
      
            // Vérifie si la réponse est correcte
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
      
            // Retourne les données JSON
            return response.json();
          } catch (error) {
            console.error("Error fetching movies:", error);
            // Gérer l'erreur en renvoyant une valeur par défaut ou en affichant un message
            return []; // Par exemple, renvoie un tableau vide en cas d'erreur
          }
        },
      },
      {
        path: "/movie_search",
        element: <MovieSearch />,
      },
      {
        path: "/movie_directors",
        element: <MovieDirectors />,
        loader: () => {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/directors`);
        },
      },
      {
        path: "/movie_casting",
        element: <MovieCasting />,
        loader: () => {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/casting`);
        },
      },
      {
        path: "/movie_screenwriters",
        element: <MovieScreenwriters />,
        loader: () => {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screenwriters`);
        },
      },
      {
        path: "/movie_music",
        element: <MovieMusic />,
        loader: () => {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/music`);
        },
      },
      {
        path: "/movie_studio",
        element: <MovieStudio />,
        loader: () => {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/studio`);
        },
      },
      {
        path: "/admin_feat",
        element: <AdminFeat />,
      },
      {
        path: "/new_movie",
        element: <AddNewMovie />,
      },
      {
        path: "/movie_entrance",
        element: <MovieInfosEntrance />,
      },
    ],
  },
]);

// Utiliser ReactDOM.createRoot pour rendre l'application complète
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);
