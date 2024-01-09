import axios from "axios";
import { useQuery } from "react-query";

const useProducts = () => {
  // TODO: load products from database
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/products.json");
      return res.data;
    },
  });

  return [products, isProductsLoading];
};

export default useProducts;
