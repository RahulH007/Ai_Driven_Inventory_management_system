import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDHERx0QzcNFP_vpAVdxNJjexZ7xoPK2X8",
    authDomain: "aidriveninventorymanagement.firebaseapp.com",
    projectId: "aidriveninventorymanagement",
    storageBucket: "aidriveninventorymanagement.firebasestorage.app",
    messagingSenderId: "628882319014",
    appId: "1:628882319014:web:2013f1dda129813b4d3667",
    measurementId: "G-976K1611LB"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };