import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm/CheckoutForm";
import useCart from "../../hooks/useCart";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const Payment = ({ setPaymentInfo, orderTotal }) => {
  const [clientSecret, setClientSecret] = useState("");
  const { cartSubtotal } = useCart();
  const [axiosSecure] = useAxiosSecure();

  useEffect(() => {
    const orderPrice = cartSubtotal?.subtotal;
    if (parseInt(orderPrice) > 0) {
      axiosSecure
        .post("/create-payment-intent", { orderPrice })
        .then((res) => setClientSecret(res.data.clientSecret));
    }
  }, [cartSubtotal]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="ml-5 mt-5">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            setPaymentInfo={setPaymentInfo}
            orderTotal={orderTotal}
          />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
