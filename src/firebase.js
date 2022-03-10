import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAUbR1vkHJ3sZBclf5NjbjPuvBAzID_vqM",
  authDomain: "mncunostintelor.firebaseapp.com",
  projectId: "mncunostintelor",
  storageBucket: "mncunostintelor.appspot.com",
  messagingSenderId: "64444680724",
  appId: "1:64444680724:web:b4edc4c03f972a0a1cb501",
  measurementId: "G-N82EMNSV8S",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
export { db,storage, firebaseApp };
