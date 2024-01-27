import React, { useState } from "react";
import logo from "/logo1dark.svg";
import "./AdminNavigation.css";
import {
  FaAngleRight,
  FaArrowLeft,
  FaGift,
  FaList,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import useAuthContext from "../../../hooks/useAuthContext";
import useUserInfo from "../../../hooks/useUserInfo";
import { FaDropbox, FaHouse } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const AdminNavigation = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { user, logOut } = useAuthContext();
  const [userFromDB] = useUserInfo();
  const [productSubmenuCollapsed, setProductSubmenuCollapsed] = useState(true);
  const [orderSubmenuCollapsed, setOrderSubmenuCollapsed] = useState(true);

  const collapseSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // handle logout user
  const handleLogout = () => {
    logOut()
      .then(() => {
        // logout successful
      })
      .catch((e) => console.error(e?.code));
  };

  return (
    <div>
      <header className="min-h-16 bg-white top-0 w-full fixed shadow z-[9999]">
        <div className="flex justify-between items-center h-16">
          <div className="flex justify-between items-center gap-x-3 w-[24%]">
            <div
              className="flex-grow flex items-center justify-around bg-[var(--pink-gold)] px-2 py-7 h-16"
              style={{ boxShadow: "inset -2px 0px 5px rgba(0, 0, 0, 0.2)" }}
            >
              <Link to={"/"} className="block w-[55%]">
                <img src={logo} alt="logo" className="w-full" />
              </Link>
              <div className=" bg-white px-5 py-1 rounded-sm">
                <p className="text-black uppercase text-xs font-bold">Admin</p>
              </div>
            </div>

            <button
              id="toggle-button"
              className="hidden lg:block w-[20%] h-12 bg-gray-100 rounded-full"
              onClick={collapseSidebar}
            >
              <FaArrowLeft
                className={`text-xl block mx-auto transition-all duration-700 ease-in-out ${
                  sidebarCollapsed && "rotate-180"
                }`}
              />
            </button>
          </div>

          <details className="dropdown dropdown-end w-fit bg-white shadow-none h-16 m-0  border-none mr-5">
            <summary className="btn p-0 ml-auto flex gap-x-3 justify-center items-center w-full bg-white shadow-none rounded-none h-16 border-none hover:bg-base-200">
              <img
                src={user?.photoURL}
                alt={userFromDB?.name}
                className="w-[20%] h-11 border rounded-full"
              />
              <div className="text-left space-y-1">
                <h5 className="font-extrabold">{userFromDB?.name}</h5>
                <p className="text-sm font-light">{user?.email}</p>
              </div>
            </summary>
            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 w-full rounded-none">
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <HashLink to="/#categories" smooth>
                  Categories
                </HashLink>
              </li>
              <li>
                <HashLink to="/#products" smooth>
                  Products
                </HashLink>
              </li>
              <li>
                <HashLink to="/#reviews" smooth>
                  Reviews
                </HashLink>
              </li>

              <li>
                <button
                  className="border block text-center rounded-none"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </details>
        </div>
      </header>

      <aside
        className={`w-[55px] ${
          !sidebarCollapsed && "lg:w-[19.72%]"
        } h-[calc(100vh-64px)] whitespace-nowrap fixed shadow overflow-x-hidden transition-all duration-500 ease-in-out top-16 bg-black`}
      >
        <div className="sidebar-menu-con flex flex-col justify-between h-full">
          <ul className="flex flex-col gap-2 mt-2 overflow-x-hidden overflow-y-auto flex-grow">
            <li className="text-white">
              {/* ------- ADMIN HOME --------- */}
              <NavLink
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? `active` : ""
                }
                to="/dashboard/adminDashboard"
              >
                <div className="px-4">
                  <FaHouse className="text-xl block" />
                </div>
                <p className={`whitespace-nowrap pt-1 pl-1`}>Dashboard</p>
              </NavLink>
            </li>
            {/* ------------ CATEGORIES ------------ */}
            <li className="text-white">
              <NavLink
                to="/dashboard/adminCategories"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? `active` : ""
                }
              >
                <div className="px-4">
                  <FaList className="text-xl block" />
                </div>
                <p className={`whitespace-nowrap pt-1 pl-1`}>Categories</p>
              </NavLink>
            </li>
            {/* ------------ PRODUCTS ------------ */}
            <li className="text-white">
              <button
                onClick={function () {
                  setProductSubmenuCollapsed(!productSubmenuCollapsed);
                  setSidebarCollapsed(false);
                }}
                className={`product-collapse-link ${
                  !productSubmenuCollapsed && "active"
                }`}
              >
                <div className="px-4">
                  <FaGift className="text-xl block" />
                </div>
                <p className={`whitespace-nowrap pt-1 pl-1`}>Products</p>
                <div
                  className={`ml-auto transition-all duration-200 ease-in-out ${
                    !productSubmenuCollapsed ? "-rotate-90 mr-2" : "mr-2 mt-1"
                  }`}
                >
                  <FaAngleRight />
                </div>
              </button>
              <div
                className={`submenu ${
                  productSubmenuCollapsed ? "hidden" : "flex"
                } flex-col w-full space-y-3`}
              >
                <NavLink
                  to="/dashboard/adminProducts"
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? `active` : ""
                  }
                >
                  Manage Products
                </NavLink>
                <NavLink
                  to="/dashboard/adminAddProducts"
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? `active` : ""
                  }
                >
                  Add Product
                </NavLink>
              </div>
            </li>
            {/* ------------ ORDERS ------------ */}
            <li className="text-white">
              <button
                onClick={function () {
                  setOrderSubmenuCollapsed(!orderSubmenuCollapsed);
                  setSidebarCollapsed(false);
                }}
                className={`product-collapse-link ${
                  !orderSubmenuCollapsed && "active"
                }`}
              >
                <div className="px-4">
                  <FaDropbox className="text-xl block" />
                </div>
                <p className={`whitespace-nowrap pt-1 pl-1`}>Orders</p>
                <div
                  className={`ml-auto transition-all duration-200 ease-in-out ${
                    !orderSubmenuCollapsed ? "-rotate-90 mr-2" : "mr-2 mt-1"
                  }`}
                >
                  <FaAngleRight />
                </div>
              </button>
              <div
                className={`submenu ${
                  orderSubmenuCollapsed ? "hidden" : "flex"
                } flex-col w-full space-y-3`}
              >
                <NavLink
                  to="/dashboard/adminProducts"
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? `active` : ""
                  }
                >
                  Manage Orders
                </NavLink>
                <NavLink
                  to="/dashboard/adminAddProducts"
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? `active` : ""
                  }
                >
                  Transactions
                </NavLink>
              </div>
            </li>
            {/* ------------ USERS ------------ */}
            <li className="text-white">
              <NavLink
                to="/dashboard/adminManageUsers"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? `active` : ""
                }
              >
                <div className="px-4">
                  <FaUsers className="text-xl block" />
                </div>
                <p className={`whitespace-nowrap pt-1 pl-1`}>Users</p>
              </NavLink>
            </li>
            {/* ------------------------ */}
          </ul>

          <ul className="flex flex-col gap-1 mt-2 border-t border-gray-500">
            <li className="text-white" onClick={handleLogout}>
              <button className="logout-btn">
                <div className="px-4">
                  <FaSignOutAlt className="text-xl block" />
                </div>
                <p className={`whitespace-nowrap block pt-1 pl-1`}>Logout</p>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AdminNavigation;
