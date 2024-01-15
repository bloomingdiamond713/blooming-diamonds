import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import toast from "react-hot-toast";

const useCart = () => {
  const { user } = useAuthContext();

  const {
    data: cartData,
    isLoading: isCartLoading,
    refetch,
  } = useQuery({
    enabled: user?.uid !== undefined,
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/cart");
      return res.data;
    },
  });

  const addToCart = async (productData, quantity = 1) => {
    const { _id, name, img, category, price, discountPrice } = productData;

    const cartProductData = {
      productId: _id,
      name,
      img,
      category,
      price: discountPrice || price,
      quantity,
      addedAt: new Date(),
    };

    // post data to cart db
    axios.post("http://localhost:5000/cart", cartProductData).then((res) => {
      if (res.data?.insertedId) {
        toast.success("Item added to cart successfully!", {
          position: "bottom-right",
        });
        refetch();
      }
    });
  };

  return [cartData, isCartLoading, refetch, addToCart];
};

export default useCart;
