import React, { createContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserInfo from "../../hooks/useUserInfo";
import Payment from "../Payment/Payment";
import useCart from "../../hooks/useCart";
import { FaPencil } from "react-icons/fa6";
import useAuthContext from "../../hooks/useAuthContext";
import { v4 as uuidv4 } from "uuid";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";
import toast from "react-hot-toast";

// Payment Context to handle payment info
export const PaymentContext = createContext(null);

const Checkout = () => {
  const { user } = useAuthContext();
  const [userFromDB] = useUserInfo();
  const [axiosSecure] = useAxiosSecure();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const { cartData, cartSubtotal, refetch } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // This function now handles PhonePe payments
  const handlePhonePePayment = async () => {
    const orderId = uuidv4();
    const orderData = {
      orderId: orderId,
      name: user?.displayName,
      email: user?.email,
      total: parseFloat(cartSubtotal?.subtotal),
      paymentMethod: "phonepe",
      paymentStatus: "unpaid", // Will be updated after confirmation
      transactionId: null, // Will be added after confirmation
      orderDetails: cartData,
      shippingAddress: userFromDB?.shippingAddress,
      orderStatus: "processing",
      date: new Date(),
    };

    // Store order data in session storage to retrieve after redirect
    sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));

    try {
      const response = await axiosSecure.post("/api/phonepe/pay", {
        totalPrice: orderData.total,
        name: orderData.name,
        // transactionId is generated on the backend for PhonePe
      });
      // Redirect to PhonePe payment page
      window.location.href = response.data.url;
    } catch (error) {
      console.error("PhonePe payment initiation failed:", error);
      toast.error("Could not connect to payment gateway. Please try again.");
      sessionStorage.removeItem("pendingOrder"); // Clean up on failure
    }
  };

  // POST ORDER DATA TO DB (for Card and COD)
  const handlePlaceOrder = () => {
    const orderId = uuidv4();

    if (orderId) {
      axiosSecure
        .post("/orders", {
          orderId: orderId,
          name: user?.displayName,
          email: user?.email,
          total: parseFloat(cartSubtotal?.subtotal),
          paymentMethod,
          paymentStatus: paymentInfo ? "paid" : "unpaid",
          transactionId: paymentInfo ? paymentInfo.id : null,
          orderDetails: cartData,
          shippingAddress: userFromDB?.shippingAddress,
          orderStatus: "processing",
          date: new Date(),
        })
        .then((res) => {
          if (res.data.insertedId) {
            axiosSecure
              .delete(`/delete-cart-items?email=${user?.email}`)
              .then((res) => {
                if (res.data.deletedCount > 0) {
                  navigate("/order-success", {
                    state: {
                      orderStatus: "success",
                      from: location,
                      orderId: orderId,
                    },
                  });
                  setPaymentInfo(null);
                  refetch();
                }
              });
          }
        });
    }
  };

  const handleFinalAction = () => {
    if (paymentMethod === "phonepe") {
      handlePhonePePayment();
    } else {
      handlePlaceOrder();
    }
  };

  return (
    <div className="container mb-20" style={{ fontFamily: "var(--poppins)" }}>
      <CustomHelmet title="Checkout" />
      <div className="text-sm breadcrumbs ml-6">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/checkout">Checkout</Link>
          </li>
        </ul>
      </div>

      <section className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start gap-6 gap-y-9 md:gap-y-0 pt-10 px-6 md:px-0">
        {/* left side - shipping address, payment */}
        <div className="flex-grow">
          <div>
            <h1 className="text-xl font-semibold mb-5">
              Shipping/Billing Address
            </h1>
            {userFromDB?.shippingAddress ? (
              <div className="border-2 border-gray-200 rounded-xl shadow p-4 w-fit">
                <div className="text-lg space-y-3 ">
                  {/* Shipping details... */}
                  <p>
                    Name:{" "}
                    <span className="font-bold">
                      {userFromDB?.shippingAddress.firstName +
                        " " +
                        userFromDB?.shippingAddress.lastName}
                    </span>
                  </p>
                  <Link to="/dashboard/myAddress">
                    <button className="btn btn-outline btn-wide mt-8">
                      <FaPencil /> Edit
                    </button>
                  </Link>
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

          {/* payment method */}
          <div className="mt-16">
            <h1 className="text-xl font-semibold mb-4">
              Choose Payment Method
            </h1>
            <div className="mt-8">
              {/* Pay with Card */}
              <div className={`p-4 ${paymentMethod === "card" && "rounded-lg"}`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="radio-1"
                    id="radio-pay-card"
                    className="radio radio-primary"
                    value={"card"}
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="radio-pay-card" className={`${paymentMethod === "card" && "font-bold"}`}>
                    Pay with Card
                  </label>
                </div>
                {paymentMethod === "card" && (
                  <PaymentContext.Provider
                    value={{
                      orderTotal: cartSubtotal?.subtotal,
                      setPaymentInfo: setPaymentInfo,
                    }}
                  >
                    <Payment />
                  </PaymentContext.Provider>
                )}
              </div>

              {/* PhonePe */}
              <div className={`p-4 mt-5 ${paymentMethod === "phonepe" && "rounded-lg"}`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="radio-1"
                    id="radio-pay-phonepe"
                    className="radio radio-primary"
                    value={"phonepe"}
                    checked={paymentMethod === "phonepe"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="radio-pay-phonepe" className={`${paymentMethod === "phonepe" && "font-bold"}`}>
                    Pay with PhonePe / UPI
                  </label>
                </div>
              </div>

              {/* Cash On Delivery */}
              <div className={`p-4 mt-5 ${paymentMethod === "cod" && "rounded-lg"}`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="radio-1"
                    id="radio-pay-cod"
                    className="radio radio-primary"
                    value={"cod"}
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="radio-pay-cod" className={`${paymentMethod === "cod" && "font-bold"}`}>
                    Cash On Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right side - cart items, place order button */}
        <div className="bg-slate-100 rounded-lg p-6 w-full md:w-[35%]">
          <div>
            <h6 className="text-lg font-semibold">Your order(s)</h6>
            <div className="my-4 space-y-4">
              {cartData?.map((item) => (
                <div key={item._id} className="flex items-center gap-3 w-full shadow rounded-lg">
                  <img src={item.img} alt={item.name} className="w-[25%]" />
                  <div className="flex-grow space-y-2">
                    <h4 className="text-lg font-medium">
                      {item.name} <span className="font-bold">x {item.quantity}</span>
                    </h4>
                    <p className="font-bold">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex justify-between items-center font-bold text-lg">
            <h5>Total</h5>
            <h5>${cartSubtotal?.subtotal}</h5>
          </div>
          <div className="divider"></div>
          <div>
            {/* Logic for displaying payment status */}
          </div>

          <button
            className="btn btn-block btn-neutral text-white mt-4"
            disabled={
              (paymentMethod === "card" && !paymentInfo) ||
              !userFromDB?.shippingAddress
            }
            onClick={handleFinalAction}
          >
            {paymentMethod === "phonepe" ? "Proceed with PhonePe" : "Place Order"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Checkout;