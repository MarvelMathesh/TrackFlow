import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAARF1Cadsawp6d1DoR9TJ6iwkJeWDfq0M",
  authDomain: "vision-fd9e3.firebaseapp.com",
  projectId: "vision-fd9e3",
  storageBucket: "vision-fd9e3.firebasestorage.app",
  messagingSenderId: "752283748965",
  appId: "1:752283748965:web:f01efce07d8e13fb91548c",
  measurementId: "G-JFYKE08132"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

signInAnonymously(auth)
  .then(() => {
    console.log('Signed in anonymously');
  })
  .catch((error) => {
    console.error('Error signing in anonymously:', error);
  });

export { db, auth };