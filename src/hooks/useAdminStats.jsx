import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";
import { auth } from '@/firebase/firebase.config.js';

const useAdminStats = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  const { data, isLoading } = useQuery({
    // This query will only run when the user is loaded
    enabled:
      !isAuthLoading &&
      user?.uid !== undefined &&
      localStorage.getItem("ub-jewellers-jwt-token") !== null,
    
    // The key for this query
    queryKey: ["admin-all-stats", user?.uid],
    
    // This function fetches all data from your new, single endpoint
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/all-stats");
      return res.data;
    },
  });

  // Return all the data from the single query.
  // We use "data?.adminStats" and "|| []" as defaults
  // to prevent errors while the data is loading.
  return {
    adminStats: data?.adminStats,
    totalCategories: data?.totalCategories || 0,
    topCategories: data?.topCategories || [],
    incomeStats: data?.incomeStats || [],
    popularProducts: data?.popularProducts || [],
    recentReviews: data?.recentReviews || [],
    isStatsLoading: isLoading, // You can use this in AdminDashboard.jsx to show a loader
  };
};

export default useAdminStats;