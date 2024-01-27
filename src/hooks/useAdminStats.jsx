import React from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import axios from "axios";

const useAdminStats = () => {
  const { user, isAuthLoading } = useAuthContext();

  const { data: adminStats } = useQuery({
    enabled: !isAuthLoading && user?.uid !== undefined,
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:5000/admin-dashboard/stats"
      );
      return res.data;
    },
  });

  return { adminStats };
};

export default useAdminStats;
