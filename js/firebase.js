// Paste the web-app configuration from Firebase Console > Project settings > Your apps.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyD5VzkoPccCf_GCl7ArJKoEoXaNqHcm6sM',
  authDomain: 'logger-7720.firebaseapp.com',
  databaseURL: 'https://logger-7720-default-rtdb.firebaseio.com',
  projectId: 'logger-7720',
  storageBucket: 'logger-7720.firebasestorage.app',
  messagingSenderId: '516045187240',
  appId: '1:516045187240:web:eaa573ce03c16ba82aba9d',
  measurementId: 'G-1DWPDS6L2Z'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
