import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../pages/Header/Header";
import Footer from "../pages/Footer/Footer";

const MainLayout = () => {
  // scroll to top on route change
  const location = useLocation();
  useEffect(() => {
    document.documentElement.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location]);

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
