import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Layout from "./components/Layout/index.jsx";
import VenuePage from "./paths/VenuePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./paths/NotFound/index.jsx";
import { SearchProvider } from "../src/contexts/SearchProvider.jsx";
import RegisterPage from "./paths/Account/RegisterPage/index.jsx";
import { Toaster } from "react-hot-toast";
import LoginPage from "./paths/Account/LoginPage/index.jsx";
import { UserProvider } from "./contexts/UserProvider.jsx";
import AccountPage from "./paths/Account/AccountPage/index.jsx";
import ProfilePage from "./paths/Profile/index.jsx";
import EditVenuePage from "./paths/EditVenuePage";
import CheckoutPage from "./paths/CheckoutPage/index.jsx";
import SuccessPage from "./paths/Success/index.jsx";
import SearchPage from "./paths/SearchPage/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "venue/:id",
        element: <VenuePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "account/:username",
        element: <AccountPage />,
      },
      {
        path: "profile/:username",
        element: <ProfilePage />,
      },
      {
        path: "edit-venue/:id",
        element: <EditVenuePage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "success",
        element: <SuccessPage />,
      },
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <SearchProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={router} />
      </SearchProvider>
    </UserProvider>
  </StrictMode>
);
