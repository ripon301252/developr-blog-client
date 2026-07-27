import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../firebase.init";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // create user/new user registration
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false),
    );
  };

  // signIn/Login
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false),
    );
  };

  // Google signIn
  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider).finally(() =>
      setLoading(false),
    );
  };

  // gitHub SignIn
  const signInGitHub = () => {
    setLoading(true);
    return signInWithPopup(auth, gitHubProvider).finally(() =>
      setLoading(false),
    );
  };

  // update user profile
  const updateUserProfile = (updateUserData) => {
    setLoading(true);
    return updateProfile(auth.currentUser, updateUserData).finally(() =>
      setLoading(false),
    );
  };

  // signOut/LogOut
  const signOutUser = () => {
    setLoading(true);
    return signOut(auth).finally(() => setLoading(false));
  };

  // reset password
  const passwordReset = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email).finally(() => setLoading(false));
  };

  // observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // show loader while user data is loading
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <span className="loading loading-bars loading-xl"></span>
  //     </div>
  //   );
  // }

  const authInfo = {
    user,
    setUser,
    registerUser,
    signInUser,
    signInGoogle,
    signInGitHub,
    updateUserProfile,
    signOutUser,
    passwordReset,
    loading,
    setLoading,
  };

  return (
    <div>
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
