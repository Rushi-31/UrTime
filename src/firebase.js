import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config={apiKey:'AIzaSyD5VzkoPccCf_GCl7ArJKoEoXaNqHcm6sM',authDomain:'logger-7720.firebaseapp.com',projectId:'logger-7720',storageBucket:'logger-7720.firebasestorage.app',messagingSenderId:'516045187240',appId:'1:516045187240:web:eaa573ce03c16ba82aba9d'};
const app=initializeApp(config);
export const auth=getAuth(app); export const db=getFirestore(app);
