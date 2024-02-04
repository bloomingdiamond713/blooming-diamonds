import React, { useEffect, useState } from "react";
import { createContext } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);
const auth = getAuth(app);

// google provier
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Sign Up with email/pass
  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update user's profile
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  // Sign In with email/pass
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign in
  const signInGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Sign Out
  const logOut = () => {
    return signOut(auth);
  };

  // Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // add user to users collection in db
        axios.post("http://localhost:5000/users", {
          name: currentUser.displayName,
          email: currentUser.email,
          img: currentUser.photoURL,
        });

        // set jwt token upon user login
        axios
          .post("http://localhost:5000/jwt", { email: currentUser.email })
          .then((res) => {
            if (res.data.token) {
              const tokenExists = localStorage.getItem(
                "ub-jewellers-jwt-token"
              );
              if (!tokenExists) {
                localStorage.setItem("ub-jewellers-jwt-token", res.data.token);
              }
            }
          })
          .catch((error) => console.error(error));

        setIsAuthLoading(false);
      } else {
        localStorage.removeItem("ub-jewellers-jwt-token");
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAuthLoading,
    signUp,
    updateUserProfile,
    signIn,
    signInGoogle,
    logOut,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
