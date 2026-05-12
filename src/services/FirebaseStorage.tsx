import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaExY1l1iIGw7VCn6n2pYMZQwd12Jks_s",
  authDomain: "diri-d07d3.firebaseapp.com",
  databaseURL: "https://diri-d07d3-default-rtdb.firebaseio.com",
  projectId: "diri-d07d3",
  storageBucket: "diri-d07d3.firebasestorage.app",
  messagingSenderId: "905855075346",
  appId: "1:905855075346:web:a4c87a18f30ffa6bda04cb"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export const auth = getAuth(app);
