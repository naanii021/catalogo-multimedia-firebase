// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATTDOSxKFnr6BML41EMcLxTFG3_1QwL4k",
  authDomain: "catalogo-bb863.firebaseapp.com",
  projectId: "catalogo-bb863",
  storageBucket: "catalogo-bb863.firebasestorage.app",
  messagingSenderId: "1019463270278",
  appId: "1:1019463270278:web:6d40c237426dcec820b607",
  measurementId: "G-YNR16NN553"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);