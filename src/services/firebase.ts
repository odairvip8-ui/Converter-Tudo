import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDcoFYNDXBSbG_A8Yy9P_-LvFaUylh2j-g",
  authDomain: "converter-tudo.firebaseapp.com",
  projectId: "converter-tudo",
  storageBucket: "converter-tudo.firebasestorage.app",
  messagingSenderId: "676574756281",
  appId: "1:676574756281:web:6a7eaa7c71435d18954a68",
  measurementId: "G-168HCM5NJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
