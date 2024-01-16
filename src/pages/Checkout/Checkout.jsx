import React from "react";
import { Link } from "react-router-dom";
import useUserInfo from "../../hooks/useUserInfo";

const Checkout = () => {
  const [userFromDB] = useUserInfo();
  return (
    <div className="container mb-20" style={{ fontFamily: "var(--poppins)" }}>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/checkout">Checkout</Link>
          </li>
        </ul>
      </div>

      {/* left side - shipping address, payment */}
      <div className="mt-10">
        <div>
          <h1 className="text-lg font-semibold mb-5">
            Shipping/Billing Address
          </h1>
          {userFromDB?.shippingAddress ? (
            <div className="border-2 border-gray-200 rounded-xl shadow p-4 w-fit">
              <div className="text-lg space-y-3 ">
                <p>
                  Name:{" "}
                  <span className="font-bold">
                    {userFromDB?.shippingAddress.firstName +
                      " " +
                      userFromDB?.shippingAddress.lastName}
                  </span>
                </p>
                <p>
                  Email:{" "}
                  <span className="font-bold">
                    {userFromDB?.shippingAddress.email}
                  </span>
                </p>
                <p>
                  Phone:{" "}
                  <span className="font-bold">
                    +{userFromDB?.shippingAddress.mobileNumber}
                  </span>
                </p>
                <p>
                  City:{" "}
                  <span className="font-bold">
                    {userFromDB?.shippingAddress.streetAddress},{" "}
                    {userFromDB?.shippingAddress.city}
                  </span>
                </p>
                <p>
                  State:{" "}
                  <span className="font-bold">
                    {userFromDB?.shippingAddress.state}
                  </span>
                </p>
                <p>
                  Country:{" "}
                  <span className="font-bold">
                    {userFromDB?.shippingAddress.country}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p>You have not added a shipping or billing address yet!</p>
              <Link to="/dashboard/myAddress">
                <button className="btn btn-outline btn-wide mt-6">ADD</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
