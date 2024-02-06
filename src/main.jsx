import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "animate.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider from "./providers/AuthProvider.jsx";
import "react-pagination-bar/dist/index.css";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
