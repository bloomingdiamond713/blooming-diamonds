import axios from "axios";
import { useQuery } from "react-query";

const useProducts = () => {
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/products");
      return res.data;
    },
  });

  return [products, isProductsLoading];
};

export default useProducts;
