// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "steptracker30",
  appId: "1:796558320689:web:c9f3f85ba20e8e99a6e110",
  storageBucket: "steptracker30.firebasestorage.app",
  apiKey: "AIzaSyAHkiLqtqnczz3_mPCAXd2EfDaSAOBkJp0",
  authDomain: "steptracker30.firebaseapp.com",
  messagingSenderId: "796558320689",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
