import React from "react";
import DashboardNav from "../pages/Dashboard/DashboardNav/DashboardNav";
import { Outlet } from "react-router-dom";
import CustomHelmet from "../components/CustomHelmet/CustomHelmet";
import useUserInfo from "../hooks/useUserInfo";

const DashboardLayout = () => {
  const [userFromDB] = useUserInfo();
  return (
    <div
      className="w-full p-4 md:container mt-10 mb-10 text-center md:text-left"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <CustomHelmet title={"Dashboard"} />

      <h1
        className="text-4xl font-bold text-black tracking-wide"
        style={{ fontFamily: "var(--italiana)" }}
      >
        Welcome, {userFromDB?.name}
      </h1>

      <div className="flex flex-col md:flex-row items-start mt-16">
        <div className="w-full md:w-[25%] border md:border-none px-3">
          <DashboardNav />
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div className="md:w-[75%] md:pl-8 mt-10 md:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
