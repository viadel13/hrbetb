import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyDK5lgV-AB9HvbAceBBUZQlQ7chs92yGtk",
  authDomain: "betb-management.firebaseapp.com",
  projectId: "betb-management",
  storageBucket: "betb-management.appspot.com",
  messagingSenderId: "324215426108",
  appId: "1:324215426108:web:d8ba37ece854959a0e0739"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore();

