import React from "react";
import ProductPageNavigation from "../pages/DynamicProduct/ProductPageNavigation/ProductPageNavigation";
import { Outlet } from "react-router-dom";
import DynamicProduct from "../pages/DynamicProduct/DynamicProduct";

const ProductPageLayout = () => {
  return (
    <div className="container" style={{ fontFamily: "var(--poppins)" }}>
      <DynamicProduct />
      <ProductPageNavigation />
      <Outlet />
    </div>
  );
};

export default ProductPageLayout;
