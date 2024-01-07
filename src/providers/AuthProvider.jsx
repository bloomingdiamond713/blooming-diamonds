import React, { useEffect, useState } from "react";
import { createContext } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Sign Up with email/pass
  const signUp = (email, password) => {
    setIsAuthLoading(true);
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
    setIsAuthLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign Out
  const logOut = () => {
    return signOut(auth);
  };

  // Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAuthLoading,
    signUp,
    updateUserProfile,
    signIn,
    logOut,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
