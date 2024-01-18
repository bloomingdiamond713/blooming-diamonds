import React from "react";
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

  return { orders, isOrdersLoading, refetch };
};

export default useOrders;
