// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBt_AsSQt54c3Y5oyF0D_d1swFe4FhWT7M",
  authDomain: "terracottaconstruction-admin.firebaseapp.com",
  projectId: "terracottaconstruction-admin",
  storageBucket: "terracottaconstruction-admin.firebasestorage.app",
  messagingSenderId: "381293354281",
  appId: "1:381293354281:web:467e5bfd394940563a6b38",
  measurementId: "G-0F5GG7F8BY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
