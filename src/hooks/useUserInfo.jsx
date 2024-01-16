import React from "react";
import useAuthContext from "./useAuthContext";
import { useQuery } from "react-query";
import axios from "axios";

const useUserInfo = () => {
  const { user } = useAuthContext();
  const {
    data: userFromDB,
    isloading: isUserLoading,
    refetch,
  } = useQuery({
    enabled: user?.uid !== undefined,
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/user?email=${user?.email}`
      );
      return res.data;
    },
  });

  return [userFromDB, isUserLoading, refetch];
};

export default useUserInfo;
