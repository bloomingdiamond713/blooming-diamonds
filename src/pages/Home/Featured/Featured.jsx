import React, { useEffect, useState } from "react";
import "./Featured.css";
import useProducts from "../../../hooks/useProducts";

const Featured = () => {
  const [products] = useProducts();
  const [featuredBanner, setFeaturedBanner] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    if (products) {
      /**
       * ********
       * Logics *
       * ********
       * Banner: to produce a banner img we are randomly selecting a product using js random number method and then setting that product as banner
       *
       * FeaturedProducts: only those products that have the featured key set to true
       *
       * BestSellers: We are sorting the products array based on Sold(a key) value of the products from max to min and slicing the first 4 items.
       */

      setFeaturedBanner(products[Math.floor(Math.random() * products.length)]);
      setFeaturedProducts(
        products.filter((product) => product.featured === true)
      );

      const sortedArray = [...products].sort((a, b) => b.sold - a.sold);
      setBestSellers(sortedArray.slice(0, 4));
    }
  }, [products]);
  console.log("best: ", bestSellers);

  return (
    <div className="container grid grid-cols-2 border">
      <div className="border">
        <img src={featuredBanner.img} alt="" />
      </div>
    </div>
  );
};

export default Featured;
