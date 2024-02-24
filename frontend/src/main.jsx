/* eslint-disable import/extensions */
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./assets/css/reset_style.css";
import "./assets/css/var_color.css";
import "./assets/css/common_elements.css";
import App from "./App.jsx";
import Home from "./pages/Home/Home.jsx";
import MovieSearch from "./pages/MovieSearch/MovieSearch.jsx";
import MovieSearchKind from "./pages/MovieSearchKind/MovieSearchKind.jsx";
import MovieDirectors from "./pages/MovieDirectors/MovieDirectors.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/movie_search",
        element: <MovieSearch />,
        loader: () => {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies`);
        },
      },
      {
        path: "/movie_kind",
        element: <MovieSearchKind />,
        loader: () => {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/kinds`);
        },
      },
      {
        path: "/movie_directors",
        element: <MovieDirectors />,
        loader: () => {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/directors`);
        },
      },
    ],
  },
]);

// Utiliser ReactDOM.createRoot pour rendre l'application complète
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
