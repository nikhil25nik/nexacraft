import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getEnv } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API"),
  authDomain: "nexacraft-adc85.firebaseapp.com",
  projectId: "nexacraft-adc85",
  storageBucket: "nexacraft-adc85.firebasestorage.app",
  messagingSenderId: "428149335688",
  appId: "1:428149335688:web:309c1942a34c1ebe80e13d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const authProvider = new GoogleAuthProvider();

export {auth, authProvider}