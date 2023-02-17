import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthKeyProvider from "./contexts/Authkey";
import ApiProvider from "./contexts/Api";
import RSAProvider from "./contexts/RSA";
import AESProvider from "./contexts/AES";
import CryptoProvider from "./contexts/Crypto";
import { Main, SignIn, SignUp, AddBook } from "./routes";
import "./styles/main.css";

const router = createBrowserRouter(
  [
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
  ],
  { basename: "/book_wishlist" }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RSAProvider>
      <AESProvider>
        <AuthKeyProvider>
          <CryptoProvider>
            <ApiProvider>
              <RouterProvider router={router} />
            </ApiProvider>
          </CryptoProvider>
        </AuthKeyProvider>
      </AESProvider>
    </RSAProvider>
  </React.StrictMode>
);
