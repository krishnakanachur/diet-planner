import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBOsTJEJ6Emf9DSNca9tixVR03TqRdo0xI",
  authDomain: "diet-planner-cd7e7.firebaseapp.com",
  projectId: "diet-planner-cd7e7",
  storageBucket: "diet-planner-cd7e7.firebasestorage.app",
  messagingSenderId: "950079688555",
  appId: "1:950079688555:web:d2847223cff25c0f08462e"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
