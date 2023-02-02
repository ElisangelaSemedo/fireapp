import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBr_v3S-yqpXFnOORCOMmsc0q7ltFvqypc",
    authDomain: "curso-7bd29.firebaseapp.com",
    projectId: "curso-7bd29",
    storageBucket: "curso-7bd29.appspot.com",
    messagingSenderId: "735539106037",
    appId: "1:735539106037:web:33e2ee07ee7a767704f5bc",
    measurementId: "G-M02N0V8Z7Q"
  };

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth };