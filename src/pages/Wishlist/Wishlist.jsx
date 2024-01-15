import React from "react";
import useWishlist from "../../hooks/useWishlist";

const Wishlist = () => {
  const [wishlistData] = useWishlist();
  return (
    <div>
      <h1>this is my wishlist with total {wishlistData?.length} products</h1>
    </div>
  );
};

export default Wishlist;
