import React from "react";
import notAuthenticated from "../../assets/Forgot password.png";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";

const RightSideDrawer = () => {
  // Reminder: Right side drawer is called from the Header.jsx file

  const { user, isLoading } = useAuthContext();

  return (
    <div className="p-5" style={{ fontFamily: "var(--poppins)" }}>
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: "var(--italiana)" }}
      >
        Shopping Cart
      </h1>
      <div className="divider"></div>
      {!user ? (
        <div className="text-center">
          <img src={notAuthenticated} alt="not authenticated image" />
          <div>
            <h4 className="text-xl mb-2">You are not logged in!</h4>
            <p>
              Please{" "}
              <Link
                to={"/login"}
                className="text-[--light-brown] font-bold underline"
              >
                Login
              </Link>{" "}
              or{" "}
              <Link
                to={"/register"}
                className="text-[--light-brown] font-bold underline"
              >
                Sign Up
              </Link>{" "}
              to see items in your cart.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h1>these are all the products in your cart</h1>
        </div>
      )}
    </div>
  );
};

export default RightSideDrawer;
