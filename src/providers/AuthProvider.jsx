import React, { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail, // Added missing import
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app } from "@/firebase/firebase.config.js"; // Use correct path from your code
import axios from "axios";

export const AuthContext = createContext(null);
const auth = getAuth(app);

// google provider
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  // Initialize user as null, not {}
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Use VITE_API_URL for base URL
  const baseURL = import.meta.env.VITE_API_URL;

  // Sign Up with email/pass
  const signUp = (email, password) => {
    setIsAuthLoading(true); // Keep loading true during signup process
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        // Save user to MongoDB after successful Firebase registration
        const newUserInfo = {
          email: userCredential.user.email,
          name: userCredential.user.displayName, // This might be null initially
          role: "user",
        };
        // Use baseURL for API call
        axios
          .post(`${baseURL}/api/users`, newUserInfo)
          .catch((error) => {
            console.error("Error saving user to MongoDB:", error);
            // Even if MongoDB save fails, Firebase signup succeeded.
            // Consider how you want to handle this scenario (e.g., retry logic?)
          });
        return userCredential; // Return the credential for potential further actions
      }
      // No need to set loading false here, onAuthStateChanged will handle it
    ).catch(error => {
      // If Firebase signup fails, stop loading
      setIsAuthLoading(false);
      // Re-throw the error so UI can handle it
      throw error;
    });
  };

  // Update user's profile
  const updateUserProfile = (name, photoURL) => {
    // No need to set loading here unless it's a very long operation
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  // Sign In with email/pass
  const signIn = (email, password) => {
    setIsAuthLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
    // No need to set loading false here, onAuthStateChanged will handle it
  };

  // Google sign in
  const signInGoogle = () => {
    setIsAuthLoading(true); // Keep loading true during sign-in
    return signInWithPopup(auth, googleProvider).then((result) => {
      // Save user to MongoDB after successful Google sign-in.
      const newUserInfo = {
        email: result.user.email,
        name: result.user.displayName,
        role: "user",
      };
      // Use baseURL for API call
      axios
        .post(`${baseURL}/api/users`, newUserInfo)
        .catch((error) => {
          console.error("Error saving user to MongoDB:", error);
           // Consider handling this error
        });
      return result; // Return result
    }).catch(error => {
      // If Google sign-in fails, stop loading
      setIsAuthLoading(false);
      // Re-throw the error
      throw error;
    });
  };

  // send password reset email (Added from my previous suggestion)
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Sign Out
  const logOut = () => {
    setIsAuthLoading(true); // Set loading before sign out starts
    return signOut(auth);
    // No need to set loading false here, onAuthStateChanged will handle it
  };

  // Auth State Observer - Refined Logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update the user state
      console.log("Auth State Changed - Current User:", currentUser?.email || 'Logged out'); // Debug log

      // If user logs IN, fetch JWT token
      if (currentUser) {
        // Use baseURL for API call
        axios
          .post(`${baseURL}/api/jwt`, {
            email: currentUser.email,
          })
          .then((res) => {
            console.log("JWT Response:", res.data); // Debug log
            if (res.data.token) {
              localStorage.setItem("ub-jewellers-jwt-token", res.data.token);
              setIsAuthLoading(false); // Set loading false AFTER token is set
            } else {
               console.error("JWT Error: No token received"); // Debug log
               localStorage.removeItem("ub-jewellers-jwt-token"); // Clear if no token
               setIsAuthLoading(false); // Still need to stop loading
            }
          })
          .catch((error) => {
            console.error("JWT Request Error:", error); // Debug log for network/server errors
            localStorage.removeItem("ub-jewellers-jwt-token"); // Clear token on error
            setIsAuthLoading(false); // Still need to stop loading
          });
      }
      // If user logs OUT, clear JWT token
      else {
        localStorage.removeItem("ub-jewellers-jwt-token");
        setIsAuthLoading(false); // Set loading false immediately on logout
      }
    });

    // cleanup function
    return () => {
      console.log("Unsubscribing from auth state changes"); // Debug log
      unsubscribe();
    };
  }, [baseURL]); // Added baseURL dependency, though it likely won't change

  const value = {
    user,
    isAuthLoading,
    signUp, // Kept your name
    updateUserProfile,
    signIn, // Kept your name
    signInGoogle, // Kept your name
    resetPassword, // Added missing function
    logOut,
    // Removed setIsAuthLoading from here, it shouldn't be exposed directly
  };

  // Use Fragment shorthand <> </>
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;