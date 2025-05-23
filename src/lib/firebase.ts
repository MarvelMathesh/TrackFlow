import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDnqaemdxoKJlpjJHH7XO2l8EgIa3iPpUA",
  authDomain: "marvel-007.firebaseapp.com",
  projectId: "marvel-007",
  storageBucket: "marvel-007.firebasestorage.app",
  messagingSenderId: "849207209470",
  appId: "1:849207209470:web:01c7364bfb6bd505a964af",
  measurementId: "G-5J2MF1DLLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;