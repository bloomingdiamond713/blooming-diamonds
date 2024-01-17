import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "./CheckoutForm/CheckoutForm";
import useCart from "../../hooks/useCart";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const Payment = ({ setPaymentInfo }) => {
  const [clientSecret, setClientSecret] = useState("");
  const { cartSubtotal: orderPrice } = useCart();

  useEffect(() => {
    if (orderPrice) {
      axios
        .post("http://localhost:5000/create-payment-intent", { orderPrice })
        .then((res) => setClientSecret(res.data.clientSecret));
    }
  }, [orderPrice]);

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
          <CheckoutForm setPaymentInfo={setPaymentInfo} />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
