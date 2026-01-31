Firebase SDKs products || chatbot-bisnisdigitaluniku.web.app
==============================================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1-w2TU_BusB_1Xdaw60uSTchdDBy8sD0",
  authDomain: "chatbot-bisnisdigital.firebaseapp.com",
  projectId: "chatbot-bisnisdigital",
  storageBucket: "chatbot-bisnisdigital.firebasestorage.app",
  messagingSenderId: "1083087150800",
  appId: "1:1083087150800:web:e7fb3a94504662f3e908d5",
  measurementId: "G-E9PMNKC0LY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);