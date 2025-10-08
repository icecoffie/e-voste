// /lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1nT-53WyyOou2AwLnUjhPZJxFCpOy8Rs",
  authDomain: "e-voste.firebaseapp.com",
  projectId: "e-voste",
  storageBucket: "e-voste.firebasestorage.app",
  messagingSenderId: "823985881373",
  appId: "1:823985881373:web:c71a585c13edd9cd73a1f4",
  measurementId: "G-NYMK2PFSLD",
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);

export { db, analytics };
