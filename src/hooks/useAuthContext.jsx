import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { auth } from '@/firebase/firebase.config.js';

const useAuthContext = () => {
  return useContext(AuthContext);
};

export default useAuthContext;
