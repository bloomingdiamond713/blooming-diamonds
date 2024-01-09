import React, { useEffect, useState } from "react";
import useProducts from "../../../hooks/useProducts";
import { useParams } from "react-router-dom";

const ProductDescription = () => {
  const { id } = useParams();
  const [products] = useProducts();
  const [dynamicProduct, setDynamicProduct] = useState(null);

  // todo: load data from database
  useEffect(() => {
    const filter = products?.find((item) => item.id == id); // find product by id
    setDynamicProduct(filter);
  }, [products, id]);

  return (
    <div className="my-7 px-3 flex justify-between items-start gap-20">
      <div className="w-[57%]">
        <h4
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: "var(--poppins)" }}
        >
          ABOUT
        </h4>
        <p className="text-lg text-gray-600 text-justify">
          {dynamicProduct?.details?.description}
        </p>

        <h4
          className="text-2xl font-bold mb-4 mt-10"
          style={{ fontFamily: "var(--poppins)" }}
        >
          ADVANTAGES
        </h4>
        <ul className="list-disc ml-5 space-y-3">
          {dynamicProduct?.details?.advantages.map((item) => (
            <li key={item} className="text-lg">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-[43%]">
        <h4
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: "var(--poppins)" }}
        >
          SHIPPING
        </h4>

        <p className="text-gray-600">
          We offer Free Standard Shipping for all orders over $75 to the 50
          states and the District of Columbia. The minimum order value must be
          $75 before taxes, shipping and handling. Shipping fees are
          non-refundable.
        </p>

        <p className="my-5 text-gray-600">
          Please allow up to 2 business days (excluding weekends, holidays, and
          sale days) to process your order.
        </p>

        <p className="text-gray-600">
          Processing Time + Shipping Time = Delivery Time
        </p>
      </div>
    </div>
  );
};

export default ProductDescription;
