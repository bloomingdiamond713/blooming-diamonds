import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../../src/layouts/MainLayout";
import ErrorPage from "../../src/pages/ErrorPage/ErrorPage";
import Home from "../../src/pages/Home/Home";
import Login from "../../src/pages/Login/Login";
import Register from "../../src/pages/Register/Register";
import ProductPageLayout from "../../src/layouts/ProductPageLayout";
import ProductDescription from "../../src/pages/DynamicProduct/ProductDescription/ProductDescription";
import ProductReviews from "../../src/pages/DynamicProduct/ProductReviews/ProductReviews";
import Shop from "../../src/pages/Shop/Shop/Shop";
import Wishlist from "../../src/pages/Wishlist/Wishlist";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import DashboardLayout from "../../src/layouts/DashboardLayout";
import MyDashboard from "../../src/pages/Dashboard/MyDashboard/MyDashboard";
import MyOrders from "../../src/pages/Dashboard/MyOrders/MyOrders";
import AddressBook from "../../src/pages/Dashboard/AddressBook/AddressBook";
import Checkout from "../../src/pages/Checkout/Checkout";
import OrderSuccess from "../../src/pages/OrderSuccess/OrderSuccess";
import AddReview from "../../src/pages/Dashboard/AddReview/AddReview";
import AdminDashboard from "../../src/pages/Dashboard/AdminDashboard/AdminDashboard";
import AdminRoute from "./AdminRoute/AdminRoute";
import AdminProducts from "../../src/pages/Dashboard/AdminProducts/AdminProducts";
import AdminAddProduct from "../../src/pages/Dashboard/AdminAddProduct/AdminAddProduct";
import AdminManageUsers from "../../src/pages/AdminManageUsers/AdminManageUsers";
import AdminCategories from "../../src/pages/AdminCategories/AdminCategories";
import AdminOrders from "../../src/pages/Dashboard/AdminOrders/AdminOrders";

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
        path: "checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "order-success",
        element: (
          <PrivateRoute>
            <OrderSuccess />
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
          {
            path: "addReview",
            element: <AddReview />,
          },
          {
            path: "adminDashboard",
            element: (
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            ),
          },
          {
            path: "adminCategories",
            element: (
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            ),
          },
          {
            path: "adminProducts",
            element: (
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            ),
          },

          {
            path: "adminAddProducts",
            element: (
              <AdminRoute>
                <AdminAddProduct />
              </AdminRoute>
            ),
          },
          {
            path: "adminUsers",
            element: (
              <AdminRoute>
                <AdminManageUsers />
              </AdminRoute>
            ),
          },
          {
            path: "adminOrders",
            element: (
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            ),
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
