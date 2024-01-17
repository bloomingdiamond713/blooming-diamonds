import React from "react";
import useOrders from "../../hooks/useOrders";

const OrderDetails = () => {
  const { orders } = useOrders();

  console.log(orders);

  return (
    <div>
      <h4>Thank You! Your order has been received.</h4>
    </div>
  );
};

export default OrderDetails;
