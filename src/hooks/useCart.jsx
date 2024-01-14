import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

const useCart = () => {
  const {
    data: cartData,
    isLoading: isCartLoading,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/cart");
      return res.data;
    },
  });

  return [cartData, isCartLoading, refetch];
};

export default useCart;
