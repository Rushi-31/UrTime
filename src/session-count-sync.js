import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';

let stopLaptop = () => {};
let stopOffline = () => {};
let laptopSessions = [];
let offlineSessions = [];
let knownDates = new Set();

async function synchronizeCounts(uid) {
  const counts = new Map();
  [...laptopSessions.filter(session => !session.active), ...offlineSessions].forEach(session => {
    if (session.date) counts.set(session.date, (counts.get(session.date) || 0) + 1);
  });
  const dates = new Set([...knownDates, ...counts.keys()]);
  knownDates = dates;
  await Promise.all([...dates].map(date => setDoc(doc(db, 'users', uid, 'dailyStats', date), { date, sessionCount: counts.get(date) || 0 }, { merge: true })));
}

onAuthStateChanged(auth, user => {
  stopLaptop(); stopOffline(); laptopSessions = []; offlineSessions = [];
  knownDates = new Set();
  if (!user) return;
  stopLaptop = onSnapshot(collection(db, 'users', user.uid, 'laptopSessions'), snapshot => {
    laptopSessions = snapshot.docs.map(item => item.data());
    synchronizeCounts(user.uid);
  });
  stopOffline = onSnapshot(collection(db, 'users', user.uid, 'offlineSessions'), snapshot => {
    offlineSessions = snapshot.docs.map(item => item.data());
    synchronizeCounts(user.uid);
  });
});
