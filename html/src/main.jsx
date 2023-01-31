import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthKeyProvider from "./contexts/Authkey";
import ApiProvider from "./contexts/Api";
import { Main, SignIn, SignUp, AddBook } from "./routes";
import "./styles/main.css";

const goToRoot = async () => {
  return redirect("/");
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>Error</div>,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "addbook",
        element: <AddBook />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthKeyProvider>
      <ApiProvider>
        <RouterProvider router={router} />
      </ApiProvider>
    </AuthKeyProvider>
  </React.StrictMode>
);
