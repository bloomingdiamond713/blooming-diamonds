import React, { useEffect, useState } from "react";
import useAuthContext from "./useAuthContext";
import { useQuery } from "react-query";
import useAxiosSecure from "./useAxiosSecure";
import { auth } from '@/firebase/firebase.config.js';

const useUserInfo = () => {
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();
  const [totalSpentArray, setTotalSpentArray] = useState([]);

  const {
    data: userFromDB,
    isLoading: isUserLoading,
    refetch,
  } = useQuery({
    enabled:
      !isAuthLoading &&
      user?.uid !== undefined &&
      localStorage.getItem("ub-jewellers-jwt-token") !== null,
    queryKey: ["user", user?.email], // More specific query key
    queryFn: async () => {
      const res = await axiosSecure.get(`/user?email=${user?.email}`);
      return res.data;
    },
  });

  // fetch total spent amount by users
  useEffect(() => {
    if (userFromDB?.admin) {
      axiosSecure.get("/admin/total-spent").then((res) => {
        setTotalSpentArray(res.data);
      });
    }
  }, [userFromDB, axiosSecure]); // Add axiosSecure to dependency array

  return [userFromDB, isUserLoading, refetch, totalSpentArray];
};

export default useUserInfo;