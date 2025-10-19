// src/pages/AdminManageUsers/AdminManageUsers.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Ensure this hook exists and works
import useAuthContext from "../../hooks/useAuthContext"; // Ensure this hook exists and works
import { useQuery } from "react-query";
import { FiCheckCircle, FiTrash2, FiUserCheck, FiXCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import { Pagination } from "react-pagination-bar";
import "react-pagination-bar/dist/index.css";
import AnimateText from "@moxy/react-animate-text";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const AdminManageUsers = () => {
  const [axiosSecure] = useAxiosSecure();
  const { user, loading } = useAuthContext();
  const [displayedUsers, setDisplayedUsers] = useState([]);

  // Fetch users using react-query
  const {
    data: users = [], // Default to empty array
    isLoading: isUsersLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", user?.email],
    enabled: !loading && !!user?.email, // Only run query when not loading and user email exists
    queryFn: async () => {
      if (!user?.email) return []; // Return empty if no user email
      const res = await axiosSecure.get(`/admin/users`); // Correct API endpoint
      return res.data;
    },
  });

   // === FIX 1: Add useEffect to update displayedUsers safely ===
   useEffect(() => {
    if (Array.isArray(users)) {
      setDisplayedUsers(users);
    } else {
      setDisplayedUsers([]); // Fallback to empty array if users is not an array
    }
  }, [users]);


  // pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const pageUserLimit = 10;

  // Handle making a user admin
  const handleMakeAdmin = (userId) => {
    Swal.fire({
      title: "Make Admin?",
      text: "Are you sure you want to grant admin privileges to this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#ef4c53",
      confirmButtonText: "Yes, Make Admin!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/admin/users/make-admin/${userId}`) // Assuming this is your endpoint
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch(); // Refetch users list
              Swal.fire(
                "Success!",
                "User has been granted admin privileges.",
                "success"
              );
            } else {
              Swal.fire("Info", "Could not update user role.", "info");
            }
          })
          .catch((err) => {
            console.error("Error making user admin:", err);
            Swal.fire("Error!", "Failed to update user role.", "error");
          });
      }
    });
  };

  // Handle deleting a user
  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Delete User?",
      text: "Are you sure you want to delete this user? This action cannot be undone.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete User!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/admin/users/delete/${userId}`) // Assuming this is your endpoint
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch(); // Refetch users list
              Swal.fire("Deleted!", "User has been deleted.", "success");
            } else {
               Swal.fire("Info", "Could not delete user.", "info");
            }
          })
          .catch((err) => {
            console.error("Error deleting user:", err);
            Swal.fire("Error!", "Failed to delete user.", "error");
          });
      }
    });
  };

  return (
    <div className="px-4">
       <CustomHelmet pageName={"Manage Users"} />
      <div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/dashboard/adminDashboard"}>Dashboard</Link>
            </li>
            <li>
              <Link to="/dashboard/adminManageUsers">Manage Users</Link>
            </li>
          </ul>
        </div>
        <h2
          className="mt-1 font-bold text-3xl"
          style={{ fontFamily: "var(--italiana)" }}
        >
          <AnimateText initialDelay={0.2} wordDelay={0.2} separator="">
            Manage Users
          </AnimateText>
        </h2>
      </div>

      <div className="p-4 shadow mt-10 border rounded-lg">
        {isUsersLoading ? (
          <div>
            {/* Skeleton Loading */}
            {Array.from({ length: 10 }).map((_, idx) => (
              <div className="skeleton w-full h-16 my-4" key={idx}></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto mt-8 pb-5">
            <table className="table table-zebra">
              <thead>
                <tr className="text-black font-bold border-b-2 border-b-black">
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* === FIX 2: Check if displayedUsers is an array before slicing/mapping === */}
                {Array.isArray(displayedUsers) && displayedUsers.length > 0 ? (
                  displayedUsers
                    .slice(
                      (currentPage - 1) * pageUserLimit,
                      currentPage * pageUserLimit
                    )
                    .map((usr) => (
                      <tr key={usr._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12 bg-slate-300">
                                <img
                                  src={usr.photoURL || "/path/to/default/avatar.png"} // Provide a default avatar
                                  alt={usr.name || "User"}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{usr.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>{usr.email}</td>
                        <td>
                          {usr.admin ? (
                             <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"> <FiCheckCircle /> Admin</span>
                          ) : (
                             <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"><FiXCircle /> User</span>
                          )}
                        </td>
                        <td className="space-x-2">
                           {!usr.admin && (
                              <div className="tooltip" data-tip="Make Admin">
                                 <button
                                 className="bg-green-500 text-white rounded-lg w-[32px] h-[32px]"
                                 onClick={() => handleMakeAdmin(usr._id)}
                                 >
                                 <FiUserCheck className="text-lg block mx-auto" />
                                 </button>
                              </div>
                           )}
                           {/* Add a check to prevent deleting the currently logged-in admin */}
                           {user?.email !== usr.email && (
                              <div className="tooltip" data-tip="Delete User">
                                 <button
                                 className="bg-red-400 text-white rounded-lg w-[32px] h-[32px]"
                                 onClick={() => handleDeleteUser(usr._id)}
                                 >
                                 <FiTrash2 className="text-lg block mx-auto" />
                                 </button>
                              </div>
                           )}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination display */}
            {Array.isArray(displayedUsers) && displayedUsers.length > pageUserLimit && (
              <>
                 <p className="text-xs mt-3">
                    Showing {(currentPage - 1) * pageUserLimit + 1} to {Math.min(currentPage * pageUserLimit, displayedUsers.length)} of {displayedUsers.length} users
                 </p>
                <Pagination
                  currentPage={currentPage}
                  totalItems={displayedUsers.length}
                  onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
                  itemsPerPage={pageUserLimit}
                  pageNeighbours={3}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageUsers;