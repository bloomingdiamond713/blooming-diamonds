import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthContext from "./useAuthContext";
import { auth } from '@/firebase/firebase.config.js';
import { api } from "../../functions";

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuthContext();

  // Create an interceptor instance of Axios with the backend base URL from .env
  const axiosSecure = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}api`, // Corrected environment variable
  });

  // Interceptor to add the auth token to every request
  axiosSecure.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("ub-jewellers-jwt-token");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor to handle logout on auth errors
  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        await logOut();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return [axiosSecure];
};

export default useAxiosSecure;