// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXbZl6SnPAXnm-xEqvMcgcJRl71SJQWwo",
  authDomain: "movie-recommender-bde14.firebaseapp.com",
  projectId: "movie-recommender-bde14",
  storageBucket: "movie-recommender-bde14.appspot.com",
  messagingSenderId: "424445043182",
  appId: "1:424445043182:web:4bff5125515a77c1beeeff",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
