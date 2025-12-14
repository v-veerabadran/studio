"use client";

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./client";

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(userCredential.user, { displayName });
  return userCredential;
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const getProvider = (provider: 'google' | 'facebook' | 'twitter') => {
    switch (provider) {
        case 'google':
            return new GoogleAuthProvider();
        case 'facebook':
            return new FacebookAuthProvider();
        case 'twitter':
            return new TwitterAuthProvider();
    }
}

export const signInWithProvider = (provider: 'google' | 'facebook' | 'twitter') => {
    const authProvider = getProvider(provider);
    return signInWithPopup(auth, authProvider);
}

export const signOutUser = () => {
  return signOut(auth);
};

export const sendPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const updateUserProfile = (user: User, profile: { displayName?: string, photoURL?: string }) => {
    return updateProfile(user, profile);
}
