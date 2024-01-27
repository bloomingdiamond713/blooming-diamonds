import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import axios from "axios";

const useAdminStats = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [totalCategories, setTotalCategories] = useState(0);
  const [topCategories, setTopCategories] = useState([]);
  const [incomeStats, setIncomeStats] = useState([]);

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

  useEffect(() => {
    if (user) {
      // get categories data
      axios
        .get("http://localhost:5000/admin-dashboard/top-selling-categories")
        .then((res) => {
          setTotalCategories(res.data.totalCategories);
          setTopCategories(res.data.topCategories);
        });

      // get income stats for last 5 and current month
      axios
        .get("http://localhost:5000/admin-dashboard/income-stats")
        .then((res) => {
          setIncomeStats(res.data);
        });
    }
  }, [user]);

  return { adminStats, totalCategories, topCategories, incomeStats };
};

export default useAdminStats;
