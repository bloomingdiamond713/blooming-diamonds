// src/pages/Payment/CheckoutForm/CheckoutForm.jsx

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuthContext from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CheckoutForm = ({ price, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [axiosSecure] = useAxiosSecure();
  const { user } = useAuthContext();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (price > 0) {
      axiosSecure.post("/create-payment-intent", { price })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [price, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    setProcessing(true);

    const { error: paymentMethodError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (paymentMethodError) {
      setCardError(paymentMethodError.message);
      setProcessing(false);
      return;
    }
    
    setCardError("");

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: user?.email || "unknown",
          name: user?.displayName || "anonymous",
        },
      },
    });

    if (confirmError) {
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const payment = {
        email: user?.email,
        transactionId: paymentIntent.id,
        price,
        date: new Date(),
        quantity: cart.length,
        cartItems: cart.map((item) => item._id),
        productItems: cart.map((item) => item.productId),
        status: "service pending",
        itemNames: cart.map((item) => item.name),
      };

      axiosSecure.post("/payments", payment)
        .then((res) => {
          if (res.data.insertedId) {
            toast.success("Payment Successful!");
            navigate("/order-success");
          }
        });
    }
    
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <button type="submit" disabled={!stripe || !clientSecret || processing}>
        Pay
      </button>
      {cardError && <p className="text-red-600 ml-1">{cardError}</p>}
    </form>
  );
};

export default CheckoutForm;