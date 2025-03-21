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
        "https://ub-jewellers-server.onrender.com/products"
      );
      return res.data;
    },
  });

  return [products, isProductsLoading, refetch];
};

export default useProducts;
