import React from "react";
import useAuthContext from "./useAuthContext";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "./useAxiosSecure";
import { auth } from "../firebase.config.js";

const useWishlist = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const {
    data: wishlistData,
    isLoading: isWishlistLoading,
    refetch,
  } = useQuery({
    enabled:
      !isAuthLoading &&
      user?.uid !== undefined &&
      localStorage.getItem("ub-jewellers-jwt-token") !== null,
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist?email=${user?.email}`);
      return res.data;
    },
  });

  const addToWishlist = (productData) => {
    if (!isAuthLoading && user?.uid !== undefined) {
      const { ["_id"]: excludedKey, ...otherProps } = productData;
      const wishlistData = {
        productId: excludedKey,
        email: user?.email,
        ...otherProps,
      };

      // post data to wishlist db
      axiosSecure
        .post(`/wishlist?email=${user?.email}`, wishlistData)
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
    }
  };

  return [wishlistData, isWishlistLoading, refetch, addToWishlist];
};

export default useWishlist;
