import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Layout from "./components/Layout/index.jsx";
import VenuePage from "./paths/VenuePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./paths/NotFound/index.jsx";
import { SearchProvider } from "../src/contexts/SearchProvider.jsx";

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
				path: "404",
				element: <NotFound />,
			},
			{
				path: "*", // 👈 catch-all route
				element: <NotFound />,
			},
		],
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<SearchProvider>
			<RouterProvider router={router} />
		</SearchProvider>
	</StrictMode>
);