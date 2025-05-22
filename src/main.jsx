import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import Layout from "./components/Layout/index.jsx";
import VenuePage from "./paths/VenuePage";
import NotFound from "./paths/NotFound/index.jsx";
import RegisterPage from "./paths/Account/RegisterPage/index.jsx";
import LoginPage from "./paths/Account/LoginPage/index.jsx";
import AccountPage from "./paths/Account/AccountPage/index.jsx";
import ProfilePage from "./paths/Profile/index.jsx";
import EditVenuePage from "./paths/EditVenuePage";
import CheckoutPage from "./paths/CheckoutPage/index.jsx";
import SuccessPage from "./paths/Success/index.jsx";
import SearchPage from "./paths/SearchPage/index.jsx";
import PrivateRoute from "./paths/PrivateRoute/index.jsx";

import { Toaster } from "react-hot-toast";
import { SearchProvider } from "./contexts/SearchProvider.jsx";
import { UserProvider } from "./contexts/UserProvider.jsx";

// ✅ Create routes as before
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <App /> },
      { path: "home", element: <App /> },
      { path: "venue/:id", element: <VenuePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "account/:username",
        element: (
          <PrivateRoute>
            <AccountPage />
          </PrivateRoute>
        ),
      },
      { path: "profile/:username", element: <ProfilePage /> },
      { path: "edit-venue/:id", element: <EditVenuePage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "success", element: <SuccessPage /> },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

// ✅ Render with RouterProvider — do NOT use <BrowserRouter>!
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
