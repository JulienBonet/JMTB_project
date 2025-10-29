/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
import React from "react";
import { createRoot } from "react-dom/client";
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
import MovieTag from "./pages/MovieArtist/MovieTags.jsx";
import AdminFeat from "./pages/AdminFeat/AdminFeat.jsx";
import AddNewMovie from "./components/AdminFeatures/AddNewMovie/AddNewMovie.jsx";
import MovieInfosEntrance from "./components/AdminFeatures/AddNewMovie/MovieInfosEntrance.jsx";

// Déterminer si on est en mode développement
const isDevelopment = import.meta.env.MODE === "development";

// Configurer l'URL de votre backend en fonction de l'environnement
const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  `http://localhost:${isDevelopment ? 3310 : process.env.APP_PORT}`; // Utilisez APP_PORT pour la prod

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
            const response = await fetch(`${backendUrl}/api/movies/sorted/nox`);
            if (!response.ok) {
              const text = await response.text(); // Lire la réponse comme texte
              console.error("Response text: ", text); // Loguer le texte de la réponse
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
          } catch (error) {
            console.error("Fetch error: ", error);
            throw error;
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
        // loader: async () => {
        //   try {
        //     const response = await fetch(`${backendUrl}/api/directors`);
        //     if (!response.ok) {
        //       const text = await response.text(); // Lire la réponse comme texte
        //       console.error("Response text: ", text); // Loguer le texte de la réponse
        //       throw new Error("Network response was not ok");
        //     }
        //     const data = await response.json();
        //     return data;
        //   } catch (error) {
        //     console.error("Fetch error: ", error);
        //     throw error;
        //   }
        // },
        loader: () => {
          return fetch(`${backendUrl}/api/directors`);
        },
      },
      {
        path: "/movie_casting",
        element: <MovieCasting />,
        loader: () => {
          return fetch(`${backendUrl}/api/casting`);
        },
      },
      {
        path: "/movie_screenwriters",
        element: <MovieScreenwriters />,
        loader: () => {
          return fetch(`${backendUrl}/api/screenwriters`);
        },
      },
      {
        path: "/movie_music",
        element: <MovieMusic />,
        loader: () => {
          return fetch(`${backendUrl}/api/music`);
        },
      },
      {
        path: "/movie_studio",
        element: <MovieStudio />,
        loader: () => {
          return fetch(`${backendUrl}/api/studio`);
        },
      },
      {
        path: "/movie_tag",
        element: <MovieTag />,
        loader: () => {
          return fetch(`${backendUrl}/api/tags`);
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

// Utiliser createRoot pour rendre l'application complète
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);
