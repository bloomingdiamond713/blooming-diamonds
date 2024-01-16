import React from "react";
import DashboardNav from "../pages/Dashboard/DashboardNav/DashboardNav";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex items-start container border-2 p-4 my-10">
      <div className="w-[40%]">
        <DashboardNav />
      </div>
      <div className="w-[60%]">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
