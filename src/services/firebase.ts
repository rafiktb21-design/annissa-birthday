import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBMTW3uPmYnRtnUIjCaKPDbf1gdg_QXt_w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "annissa-birthday.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "annissa-birthday",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "annissa-birthday.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "830191414339",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:830191414339:web:7a4d45a85132c5c73a38f6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-63C02R89CM",
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
)

let app: FirebaseApp | null = null
let db: Firestore | null = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    db = getFirestore(app)
  } catch (error) {
    console.warn('Firebase initialization warning:', error)
  }
}

export { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp }
