import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyATeIKbhBAqbdBDcqIgRUWlH3huFZwYm1c",
    authDomain: "cunp-2c71a.firebaseapp.com",
    projectId: "cunp-2c71a",
    storageBucket: "cunp-2c71a.firebasestorage.app",
    messagingSenderId: "817367612740",
    appId: "1:817367612740:web:94f1e88671cf3ac8426b11",
    measurementId: "G-E49PJH5BRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
