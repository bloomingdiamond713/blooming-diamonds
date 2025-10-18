import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useAuthContext from "./useAuthContext";
import useAxiosSecure from "./useAxiosSecure";
import { auth } from '@/firebase/firebase.config.js';

const useAdminStats = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();
  const [totalCategories, setTotalCategories] = useState(0);
  const [topCategories, setTopCategories] = useState([]);
  const [incomeStats, setIncomeStats] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  const { data: adminStats } = useQuery({
    enabled:
      !isAuthLoading &&
      user?.uid !== undefined &&
      localStorage.getItem("ub-jewellers-jwt-token") !== null,
    queryKey: ["admin-stats", user?.uid], // More specific query key
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard/stats");
      return res.data;
    },
  });

  // Consolidated all data fetching into one stable useEffect
  useEffect(() => {
    // Only run if the user is loaded and has a UID
    if (user?.uid) {
      // get categories data
      axiosSecure.get("/admin-dashboard/top-selling-categories").then((res) => {
        setTotalCategories(res.data.totalCategories);
        setTopCategories(res.data.topCategories);
      });

      // get income stats for last 5 and current month
      axiosSecure.get("/admin-dashboard/income-stats").then((res) => {
        setIncomeStats(res.data);
      });

      // get popular products
      axiosSecure
        .get("/admin-dashboard/popular-products")
        .then((res) => setPopularProducts(res.data));

      // get recent reviews
      axiosSecure
        .get("/admin-dashboard/recent-reviews")
        .then((res) => setRecentReviews(res.data));
    }
  }, [user?.uid, axiosSecure]); // Runs only when user ID or axios instance changes

  return {
    adminStats,
    totalCategories,
    topCategories,
    incomeStats,
    popularProducts,
    recentReviews,
  };
};

export default useAdminStats;