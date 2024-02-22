import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../src/assets/css/reset_style.css";
import "../src/assets/css/var_color.css";
import "../src/assets/css/common_elements.css";
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
      },
      {
        path: "/movie_kind",
        element: <MovieSearchKind />,
      },
      {
        path: "/movie_directors",
        element: <MovieDirectors />,
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
