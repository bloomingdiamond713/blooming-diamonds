import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import axios from "axios";

const useOrders = () => {
  const { user } = useAuthContext();

  // get all orders by email
  const {
    data: orders,
    isLoading: isOrdersLoading,
    refetch,
  } = useQuery({
    enabled: user?.uid !== undefined,
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/orders?email=${user?.email}`
      );
      return res.data;
    },
  });

  // get total amount spent on the orders
  const [totalSpent, setTotalSpent] = useState(0);
  useEffect(() => {
    if (orders) {
      const sum = orders.reduce((totalAmount, item) => {
        return totalAmount + parseFloat(item.total);
      }, 0);

      setTotalSpent(sum.toFixed(2));
    }
  }, [orders]);

  return { orders, isOrdersLoading, refetch, totalSpent };
};

export default useOrders;
