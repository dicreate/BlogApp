// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-738bd.firebaseapp.com",
  projectId: "mern-blog-738bd",
  storageBucket: "mern-blog-738bd.appspot.com",
  messagingSenderId: "831828226385",
  appId: "1:831828226385:web:14663962df17573b782370",
  measurementId: "G-DLK4D8WB37"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

