import React from "react";
import logo from "/logo1dark.svg";
import { FaArrowLeft } from "react-icons/fa";
import useAuthContext from "../../../hooks/useAuthContext";
import useUserInfo from "../../../hooks/useUserInfo";
import { Link } from "react-router-dom";
import { FaHouse } from "react-icons/fa6";

const AdminNavigation = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { user } = useAuthContext();
  const [userFromDB] = useUserInfo();

  const collapseSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
              <img src={logo} alt="logo" className="w-[55%]" />
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
                className={`text-2xl block mx-auto transition-all duration-700 ease-in-out ${
                  sidebarCollapsed && "rotate-180"
                }`}
              />
            </button>
          </div>

          <details className="dropdown dropdown-end w-fit bg-white shadow-none h-16 m-0  border-none">
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
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </details>
        </div>
      </header>

      <aside
        className={`w-[68px] ${
          !sidebarCollapsed && "lg:w-[19.7%]"
        } h-[calc(100vh-100px)] whitespace-nowrap fixed shadow overflow-x-hidden transition-all duration-500 ease-in-out top-16 bg-[#3d464d]`}
      >
        <div className="flex flex-col justify-between h-full">
          <ul className="flex flex-col gap-1 mt-2">
            <li className="text-white hover:bg-[#b0aeae76] px-2">
              <Link
                className="w-full flex items-center py-3"
                to="/dashboard/adminDashboard"
              >
                <div className="px-4">
                  <FaHouse className="text-2xl block" />
                </div>
                <p className={`whitespace-nowrap pt-1 pl-1`}>Dashboard</p>
              </Link>
            </li>
          </ul>

          <ul className="flex flex-col gap-1 mt-2">
            <li className="text-gray-500 hover:bg-gray-100 hover:text-gray-900">
              <a className="w-full flex items-center py-3" href="#">
                <i className="fa-solid fa-right-from-bracket text-center"></i>
                <span className="pl-1">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AdminNavigation;
