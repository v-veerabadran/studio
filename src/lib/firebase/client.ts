"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-4609773787-4259f",
  "appId": "1:68529439164:web:441be4b21f72751abfebb9",
  "apiKey": "AIzaSyBDX2FAIkLjOV0_rcKKRGdEi2S05W_3y7A",
  "authDomain": "studio-4609773787-4259f.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "68529439164"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
