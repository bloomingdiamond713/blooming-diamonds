import React from "react";
import "./RightSideDrawer.css";
import notAuthenticated from "../../assets/Forgot password.png";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { FaMinus, FaPlus } from "react-icons/fa6";

const RightSideDrawer = () => {
  // Reminder: Right side drawer is called from the Header.jsx file

  const { user, isLoading } = useAuthContext();
  const [cartData, isCartLoading, refetch] = useCart();

  return (
    <div
      className="p-5 flex flex-col h-screen"
      style={{ fontFamily: "var(--poppins)" }}
    >
      <div className="right-drawer-header">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--italiana)" }}
        >
          Shopping Cart
        </h1>
        <div className="divider"></div>
      </div>

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
        <>
          <div className="right-drawer-items-con overflow-auto pr-3 flex-grow">
            {isCartLoading ? (
              <div>
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : (
              <div className="space-y-6">
                {cartData?.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 w-full"
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-[35%] border-none rounded-lg bg-slate-100"
                    />
                    <div className="w-[75%]">
                      <h5 className="font-bold">{product.name}</h5>
                      <p className="mt-2 font-semibold">$ {product.price}</p>
                      <div className="w-[60%] flex items-center justify-between border border-black mt-4 py-1 px-2">
                        <button>
                          <FaMinus />
                        </button>
                        <span className="font-bold text-lg">0</span>
                        <button>
                          <FaPlus />
                        </button>
                      </div>
                      {/* --------------- */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="right-drawer-footer border py-5 mt-5">
            <h1>Subtotal</h1>
          </div>
        </>
      )}
    </div>
  );
};

export default RightSideDrawer;
