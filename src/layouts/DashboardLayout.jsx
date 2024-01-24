import React from "react";
import DashboardNav from "../pages/Dashboard/DashboardNav/DashboardNav";
import { Outlet } from "react-router-dom";
import CustomHelmet from "../components/CustomHelmet/CustomHelmet";
import useUserInfo from "../hooks/useUserInfo";
import AdminNavigation from "../pages/Dashboard/AdminNavigation/AdminNavigation";

const DashboardLayout = () => {
  const [userFromDB, isUserLoading] = useUserInfo();
  return (
    <div style={{ fontFamily: "var(--poppins)" }}>
      <CustomHelmet title={"Dashboard"} />

      <>
        {!isUserLoading && !userFromDB?.admin ? (
          <div className="w-full p-4 md:container mt-10 mb-10 text-left">
            <h1
              className="text-4xl font-bold text-black tracking-wide"
              style={{ fontFamily: "var(--italiana)" }}
            >
              Welcome, {userFromDB?.name}
            </h1>

            <div className="flex flex-col md:flex-row items-start mt-16">
              <div className="w-full md:w-[25%] md:border-none overflow-auto">
                <DashboardNav />
              </div>
              <div className="md:divider md:divider-horizontal"></div>
              <div className="md:w-[75%] md:pl-8 mt-10 md:mt-0">
                <Outlet />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <AdminNavigation />
            <div className="my-24">
              <Outlet />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default DashboardLayout;
