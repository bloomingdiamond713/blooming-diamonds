import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ProductPageLayout from "../layouts/ProductPageLayout";
import ProductDescription from "../pages/DynamicProduct/ProductDescription/ProductDescription";
import ProductReviews from "../pages/DynamicProduct/ProductReviews/ProductReviews";
import Shop from "../pages/Shop/Shop/Shop";
import Wishlist from "../pages/Wishlist/Wishlist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "products/:id",
        element: <ProductPageLayout />,
        children: [
          {
            path: "description",
            element: <ProductDescription />,
          },
          {
            path: "reviews",
            element: <ProductReviews />,
          },
        ],
      },
    ],
  },
]);

export default router;
