import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpUOJYbz_69DRLqe13dIB2BhXoVLjERRM",
  authDomain: "netflix-clone-8feca.firebaseapp.com",
  projectId: "netflix-clone-8feca",
  storageBucket: "netflix-clone-8feca.firebasestorage.app",
  messagingSenderId: "673552891722",
  appId: "1:673552891722:web:208429a528205ea98d0bb3",
  measurementId: "G-R6G1YQL7JX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
