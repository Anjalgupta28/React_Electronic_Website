import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getMessaging } from "firebase/messaging";
import {getAnalytics} from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDg7OqGs5LpKSTM6B7FtYjAwcCRQdJ-9kw",
  authDomain: "student-crud-apps.firebaseapp.com",
  projectId: "student-crud-apps",
  storageBucket: "student-crud-apps.appspot.com",
  messagingSenderId: "358948158174",
  appId: "1:358948158174:web:0ba4394a20e82d6db6604f",
  measurementId: "G-KTTL8YSR04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); //main
const db = getFirestore(app)
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

export { app, db, messaging, analytics };
