import axios from "axios";
import { useQuery } from "react-query";

const useProducts = () => {
  const {
    data: products,
    isLoading: isProductsLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get(
        "api/products"
      );
      return res.data;
    },
  });

  return [products, isProductsLoading, refetch];
};

export default useProducts;
