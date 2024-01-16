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
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyDashboard from "../pages/Dashboard/MyDashboard/MyDashboard";
import MyOrders from "../pages/Dashboard/MyOrders/MyOrders";
import AddressBook from "../pages/Dashboard/AddressBook/AddressBook";

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
        element: (
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          {
            path: "myDashboard",
            element: <MyDashboard />,
          },
          {
            path: "myOrders",
            element: <MyOrders />,
          },
          {
            path: "myAddress",
            element: <AddressBook />,
          },
        ],
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
