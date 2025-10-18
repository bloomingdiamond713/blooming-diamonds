import React, { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app } from "@/firebase/firebase.config.js";
import axios from "axios";
import { useQueryClient } from "react-query"; // 1. IMPORT THIS

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const baseURL = import.meta.env.VITE_API_URL; // Use the environment variable
  const queryClient = useQueryClient(); // 2. GET THE CLIENT INSTANCE

  const signUp = (email, password) => {
    setIsAuthLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const newUserInfo = {
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          role: "user",
        };
        // Use baseURL for API call
        axios.post(`${baseURL}/api/users`, newUserInfo).catch((error) => {
          console.error("Error saving user to MongoDB:", error);
        });
        return userCredential;
      }
    ).catch(error => {
      setIsAuthLoading(false);
      throw error;
    });
  };

  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const signIn = (email, password) => {
    setIsAuthLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = () => {
    setIsAuthLoading(true);
    return signInWithPopup(auth, googleProvider).then((result) => {
      const newUserInfo = {
        email: result.user.email,
        name: result.user.displayName,
        role: "user",
      };
      // Use baseURL for API call
      axios.post(`${baseURL}/api/users`, newUserInfo).catch((error) => {
        console.error("Error saving user to MongoDB:", error);
      });
      return result;
    }).catch(error => {
      setIsAuthLoading(false);
      throw error;
    });
  };
  
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Sign Out
  const logOut = () => {
    setIsAuthLoading(true);
    queryClient.clear(); // 3. CLEAR REACT QUERY CACHE ON LOGOUT
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Use baseURL for API call
        axios.post(`${baseURL}/api/jwt`, { email: currentUser.email })
          .then((res) => {
            if (res.data.token) {
              localStorage.setItem("ub-jewellers-jwt-token", res.data.token);
              setIsAuthLoading(false);
            }
          })
          .catch(error => {
            console.error("JWT request failed:", error);
            setIsAuthLoading(false);
          });
      } else {
        localStorage.removeItem("ub-jewellers-jwt-token");
        setIsAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [baseURL, queryClient]); // Add queryClient to dependencies

  const value = {
    user,
    isAuthLoading,
    signUp,
    updateUserProfile,
    signIn,
    signInGoogle,
    resetPassword,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
