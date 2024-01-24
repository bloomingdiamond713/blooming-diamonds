import React, { useState } from "react";
import logo from "/logo1dark.svg";
import { FaArrowLeft } from "react-icons/fa";

const AdminNavigation = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const collapseSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const openUserDropdown = () => {
    console.log("clicked");
  };
  return (
    <div>
      <header className="min-h-16 bg-white top-0 w-full fixed shadow z-[9999]">
        <div className="flex justify-between items-center min-h-16">
          <div className="flex justify-between items-center gap-x-2 w-[24%]">
            <div
              className="flex-grow flex items-center justify-around bg-[var(--pink-gold)] p-2 h-16"
              style={{ boxShadow: "inset -5px 1px 5px rgba(0, 0, 0, 0.2)" }}
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

          <ul className="flex items-center gap-5 border">
            <li className="">
              <a className="bg-gray-200 px-3 py-2 rounded-sm" href="#">
                <i className="fa-regular fa-bell"></i>
              </a>
            </li>
            <li className="" onClick={openUserDropdown}>
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white cursor-pointer"
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <ul
                id="user-dropdown"
                className="absolute hidden bg-white right-4 top-14 w-28 rounded shadow-md"
              >
                <li className="mb-1 hover:bg-gray-50 text-gray-700 hover:text-gray-900">
                  <a className="block px-5 py-2" href="#">
                    Profile
                  </a>
                </li>
                <li className="mb-1 hover:bg-gray-50 text-gray-700 hover:text-gray-900">
                  <a className="block px-5 py-2" href="#">
                    Settings
                  </a>
                </li>
                <li className="mb-1 hover:bg-gray-50 text-gray-700 hover:text-gray-900">
                  <a className="block px-5 py-2" href="#">
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default AdminNavigation;
