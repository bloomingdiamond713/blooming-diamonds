import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import toast from "react-hot-toast";
import useAxiosSecure from "./useAxiosSecure";

const useCart = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [axiosSecure] = useAxiosSecure();

  const {
    data: cartData,
    isLoading: isCartLoading,
    refetch,
  } = useQuery({
    enabled: !isAuthLoading && user?.uid !== undefined,
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/cart?email=${user?.email}`);
      return res.data;
    },
  });

  // fetch subtotal amount of cart
  useEffect(() => {
    if (user) {
      axiosSecure
        .get(`/cart/subtotal?email=${user?.email}`)
        .then((res) => setCartSubtotal(res.data.subtotal));
    }
  }, [user]);

  // post product data to cart
  const addToCart = async (productData, quantity = 1) => {
    const { _id, name, img, category, price, discountPrice } = productData;

    const cartProductData = {
      productId: _id,
      email: user?.email,
      name,
      img,
      category,
      price: discountPrice || price,
      quantity,
      addedAt: new Date(),
    };

    axiosSecure.post("/cart", cartProductData).then((res) => {
      if (res.data?.insertedId) {
        toast.success("Cart Updated", {
          position: "bottom-right",
        });
        refetch();
      }
    });
  };

  return { cartData, isCartLoading, refetch, addToCart, cartSubtotal };
};

export default useCart;
