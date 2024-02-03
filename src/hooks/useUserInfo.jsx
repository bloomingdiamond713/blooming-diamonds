import React, { useEffect, useState } from "react";
import useAuthContext from "./useAuthContext";
import { useQuery } from "react-query";
import axios from "axios";

const useUserInfo = () => {
  const { user } = useAuthContext();
  const [totalSpentArray, setTotalSpentArray] = useState([]);

  const {
    data: userFromDB,
    isLoading: isUserLoading,
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

  // fetch total spent amount by users
  useEffect(() => {
    if (userFromDB?.admin) {
      axios.get("http://localhost:5000/admin/total-spent").then((res) => {
        setTotalSpentArray(res.data);
      });
    }
  }, [userFromDB]);

  return [userFromDB, isUserLoading, refetch, totalSpentArray];
};

export default useUserInfo;
