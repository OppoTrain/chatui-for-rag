// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhFAMB3Cx_OexeYStG086cQMsxzSywAYI",
  authDomain: "rag-model-a7d6d.firebaseapp.com",
  projectId: "rag-model-a7d6d",
  storageBucket: "rag-model-a7d6d.firebasestorage.app",
  messagingSenderId: "240005492940",
  appId: "1:240005492940:web:34466e30fd42d630b89269",
  measurementId: "G-DYWLHY7MFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
