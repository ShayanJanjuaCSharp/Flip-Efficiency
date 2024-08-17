// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "flashcards-saas-dm.firebaseapp.com",
  projectId: "flashcards-saas-dm",
  storageBucket: "flashcards-saas-dm.appspot.com",
  messagingSenderId: "677863957255",
  appId: "1:677863957255:web:09bb4117044f4a98319ba2",
  measurementId: "G-YJD7GFNKCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }