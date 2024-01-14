import React, { useEffect, useState } from "react";
import "./NewProducts.css";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import ProductCard from "../../../components/ProductCard/ProductCard";
import useProducts from "../../../hooks/useProducts";
import CardSkeleton from "../../../components/CardSkeleton/CardSkeleton";

const NewProducts = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [products, isProductsLoading] = useProducts();

  useEffect(() => {
    // filter only new products from all products
    const filteredNewProducts = products?.filter(
      (product) => product.newArrival === true
    );

    setNewProducts(filteredNewProducts?.slice(0, 6));
  }, [products]);

  return (
    <section className="mb-24 pt-10">
      <SectionTitle title={"New Arrivals"} />

      {isProductsLoading ? (
        <div className="grid grid-cols-3 gap-x-16 gap-y-10 mt-14 mb-16 w-fit mx-auto">
          {/* iterate empty array of length 6 */}
          {[...Array(6)].map((item, idx) => (
            <CardSkeleton key={idx} height={"340px"} width={"330px"} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-x-16 gap-y-10 mt-14 mb-16 w-fit mx-auto">
            {newProducts?.map((product) => (
              <ProductCard key={product.id} cardData={product} />
            ))}
          </div>

          <button className="btn btn-outline mx-auto block btn-wide">
            View all items
          </button>
        </>
      )}
    </section>
  );
};

export default NewProducts;
