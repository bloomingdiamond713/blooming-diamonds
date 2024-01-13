import axios from "axios";
import React, { useEffect, useState } from "react";

const useFilterByQuery = (queryObj) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const { queryKey, searchText, selectedCategory } = queryObj;

  //   console.log(queryKey, searchText, selectedCategory);

  useEffect(() => {
    setIsFilterLoading(true);
    axios
      .get(
        `http://localhost:5000/products?${queryKey}=${
          searchText || selectedCategory
        }`
      )
      .then((res) => {
        setFilteredProducts(res.data);
        setIsFilterLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsFilterLoading(false);
      });
  }, [searchText, selectedCategory, queryKey]);

  return { filteredProducts, isFilterLoading };
};

export default useFilterByQuery;
