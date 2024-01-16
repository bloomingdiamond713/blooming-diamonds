import React from "react";
import "./DashboardNav.css";
import { Link } from "react-router-dom";
import useAuthContext from "../../../hooks/useAuthContext";

const DashboardNav = () => {
  const { logOut } = useAuthContext();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        // logout successful
      })
      .catch((err) => console.error(err));
  };
  return (
    <nav className="border h-[300px] flex flex-col gap-3">
      <Link to={"/dashboard/myDashboard"}>Account Dashboard</Link>
      <Link to={"/dashboard/myOrders"}>My Orders</Link>
      <Link to={"/dashboard/myAddress"}>Address Book</Link>
      <Link onClick={handleLogOut}>Log Out</Link>
    </nav>
  );
};

export default DashboardNav;
