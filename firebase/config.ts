import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDuMCW5g0WbjS5weCqMF_ddj5duAUhroKg",
  authDomain: "fir-7bb8f.firebaseapp.com",
  projectId: "fir-7bb8f",
  storageBucket: "fir-7bb8f.firebasestorage.app",
  messagingSenderId: "608996338682",
  appId: "1:608996338682:web:9d5d92cfdfb935b8f39243",
  measurementId: "G-LB95XBYST2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;

