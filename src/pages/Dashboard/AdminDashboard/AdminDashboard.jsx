import React from "react";
import "./AdminDashboard.css";
import {
  PiChartLineUp,
  PiListChecksBold,
  PiCurrencyDollarBold,
  PiChartBarBold,
  PiUsersThreeBold,
} from "react-icons/pi";

const AdminDashboard = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-stretch">
      {/*----------------- stats ------------------*/}
      <div className="flex justify-between items-start border p-4 rounded-lg w-full md:w-1/4">
        <div>
          <h4 className="text-2xl font-bold mb-1">$1111</h4>
          <p className="text-gray-600 text-sm">Total Sells</p>

          <div>
            <div className="mt-6 flex items-center gap-2 w-fit bg-green-100 text-green-600 px-2 py-1 text-sm rounded">
              <span>12%</span>
              <PiChartLineUp />
            </div>

            <p className="text-xs text-gray-500 pt-1">
              Compared to December, 2023
            </p>
          </div>
        </div>
        <div>
          <span className="text-lg text-white rounded-full flex items-center justify-center h-11 w-11 shrink-0 bg-green-500">
            <PiCurrencyDollarBold className="text-2xl" />
          </span>
        </div>
      </div>

      {/* ----------------------------------------- */}
      <div className="flex justify-between items-start border p-4 rounded-lg w-full md:w-1/4">
        <div>
          <h4 className="text-2xl font-bold mb-1">356</h4>
          <p className="text-gray-600 text-sm">Orders Received</p>

          <div>
            <div className="mt-6 flex items-center gap-2 w-fit bg-purple-100 text-purple-600 px-2 py-1 text-sm rounded">
              <span>12%</span>
              <PiChartLineUp />
            </div>

            <p className="text-xs text-gray-500 pt-1">
              Compared to December, 2023
            </p>
          </div>
        </div>
        <div>
          <span className="text-lg text-white rounded-full flex items-center justify-center h-11 w-11 shrink-0 bg-purple-500">
            <PiListChecksBold className="text-2xl" />
          </span>
        </div>
      </div>

      {/* -------------------------------------------- */}
      <div className="flex justify-between items-start border p-4 rounded-lg w-full md:w-1/4">
        <div>
          <h4 className="text-2xl font-bold mb-1">$100</h4>
          <p className="text-gray-600 text-sm">Average Order Value</p>

          <div>
            <div className="mt-6 flex items-center gap-2 w-fit bg-blue-100 text-blue-600 px-2 py-1 text-sm rounded">
              <span>12%</span>
              <PiChartLineUp />
            </div>

            <p className="text-xs text-gray-500 pt-1">
              Compared to December, 2023
            </p>
          </div>
        </div>
        <div>
          <span className="text-lg text-white rounded-full flex items-center justify-center h-11 w-11 shrink-0 bg-blue-500">
            <PiChartBarBold className="text-2xl" />
          </span>
        </div>
      </div>

      {/* --------------------------------------------- */}
      <div className="flex justify-between items-start border p-4 rounded-lg w-full md:w-1/4">
        <div>
          <h4 className="text-2xl font-bold mb-1">20</h4>
          <p className="text-gray-600 text-sm">New Customers</p>

          <div>
            <div className="mt-6 flex items-center gap-2 w-fit bg-yellow-100 text-yellow-600 px-2 py-1 text-sm rounded">
              <span>12%</span>
              <PiChartLineUp />
            </div>

            <p className="text-xs text-gray-500 pt-1">
              Compared to December, 2023
            </p>
          </div>
        </div>
        <div>
          <span className="text-lg text-white rounded-full flex items-center justify-center h-11 w-11 shrink-0 bg-yellow-500">
            <PiUsersThreeBold className="text-2xl" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
