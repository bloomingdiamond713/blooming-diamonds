import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import useAuthContext from "../../../hooks/useAuthContext";

const CheckoutForm = ({ setPaymentInfo }) => {
  const { user } = useAuthContext();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: {
            name: user?.displayName || "anonymous",
            email: user?.email || "unknown",
          },
        },
      },
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage({ errorOccured: true, message: error?.message });
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setPaymentInfo(paymentIntent);
      setMessage({ errorOccured: false, message: "Payment Successful 🎉" });
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="border md:w-[60%] p-8 pb-6 rounded-xl shadow"
    >
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button
        disabled={
          isLoading || !stripe || !elements || message?.errorOccured === false
        }
        id="submit"
        className="btn btn-primary font-bold btn-block text-white mt-6"
      >
        <span id="button-text">
          {isLoading ? (
            <span className="loading loading-spinner text-primary"></span>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message?.errorOccured ? (
        <div
          id="payment-message"
          className="mt-5 text-center text-error font-bold text-lg"
        >
          {message?.message}
        </div>
      ) : (
        <div className="mt-5 text-center text-success font-bold text-lg">
          {message?.message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
