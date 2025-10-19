// src/hooks/useProducts.jsx
import { useEffect, useState } from "react";

const useProducts = (categoryName) => {
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    console.log("useProducts: Fetching products...", { categoryName }); // Log start
    setProductsLoading(true);
    setProducts([]); // Reset products to empty array on new fetch

    fetch(
      `${import.meta.env.VITE_API_URL}/api/products${
        categoryName ? `?category=${categoryName}` : ""
      }`
    )
      .then((res) => {
        console.log("useProducts: Received response status:", res.status); // Log status
        if (!res.ok) {
          // Important: Check if response status is OK (200-299)
          console.error("useProducts: HTTP error!", res.status, res.statusText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("useProducts: Received data:", data); // Log the actual data
        if (Array.isArray(data)) {
          setProducts(data);
          console.log("useProducts: Set products state with array."); // Confirm setting array
        } else {
          console.error(
            "useProducts: Data received is NOT an array. Setting empty array.", data
          );
          setProducts([]); // Fallback to empty array if data is not an array
        }
        setProductsLoading(false);
      })
      .catch((error) => {
        console.error("useProducts: Fetch failed:", error); // Log fetch errors
        setProducts([]); // Set empty array on ANY error
        setProductsLoading(false);
      });
  }, [categoryName]);

  // Log state changes (optional but can be helpful)
  // useEffect(() => {
  //   console.log("useProducts: State updated", { products, isProductsLoading });
  // }, [products, isProductsLoading]);

  return [products, isProductsLoading];
};

export default useProducts;