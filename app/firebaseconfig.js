import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc, updateDoc, setDoc
 } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZGeHPedLcAuJbPbApdRgjG4K94v_-LnQ",
  authDomain: "busrvs.firebaseapp.com",
  projectId: "busrvs",
  storageBucket: "busrvs.appspot.com",
  messagingSenderId: "687694941606",
  appId: "1:687694941606:web:152d479158f4029fa41367"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db, getDoc, doc, updateDoc, setDoc };