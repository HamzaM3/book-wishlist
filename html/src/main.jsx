import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Book from "./Book";
import Layout from "./layouts/Layout";
import AuthKeyProvider from "./contexts/Authkey";
import ApiProvider from "./contexts/Api";
import { Main, SignIn, SignUp } from "./routes";

const goToRoot = async () => {
  return redirect("/");
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
    ],
  },
  {
    path: "/*",
    loader: goToRoot,
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
