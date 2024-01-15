import React from "react";
import useAuthContext from "./useAuthContext";
import { useQuery } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";

const useWishlist = () => {
  const { user } = useAuthContext();

  const {
    data: wishlistData,
    isLoading: isWishlistLoading,
    refetch,
  } = useQuery({
    enabled: user?.uid !== undefined,
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/wishlist");
      return res.data;
    },
  });

  const addToWishlist = (productData) => {
    const { ["_id"]: excludedKey, ...otherProps } = productData;
    const wishlistData = { productId: excludedKey, ...otherProps };

    // post data to wishlist db
    axios
      .post("http://localhost:5000/wishlist", wishlistData)
      .then((res) => {
        if (res.data?.insertedId) {
          toast.success("Item added to your wishlist!", {
            position: "bottom-right",
          });
          refetch();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return [wishlistData, isWishlistLoading, refetch, addToWishlist];
};

export default useWishlist;
