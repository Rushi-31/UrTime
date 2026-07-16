import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

const toDate = value => value?.toDate ? value.toDate() : new Date(value);
const overlap = (start, end, otherStart, otherEnd) => start < otherEnd && end > otherStart;

async function entriesForToday() {
  const user = auth.currentUser;
  if (!user) return [];
  const [laptop, offline] = await Promise.all([
    getDocs(collection(db, 'users', user.uid, 'laptopSessions')),
    getDocs(collection(db, 'users', user.uid, 'offlineSessions'))
  ]);
  const now = new Date();
  return [
    ...laptop.docs.map(item => ({ type: 'laptop session', ...item.data() })),
    ...offline.docs.map(item => ({ type: 'offline study', ...item.data() }))
  ].filter(item => item.date === now.toLocaleDateString('en-CA')).map(item => ({
    ...item,
    start: toDate(item.startTime),
    end: item.endTime ? toDate(item.endTime) : now
  }));
}

async function validateTopup(form) {
  const times = form.querySelectorAll('input[type="time"]');
  const date = new Date().toLocaleDateString('en-CA');
  const start = new Date(`${date}T${times[0].value}`);
  const end = new Date(`${date}T${times[1].value}`);
  if (!(start < end)) return 'Choose an end time after the start time.';
  const conflict = (await entriesForToday()).find(entry => overlap(start, end, entry.start, entry.end));
  return conflict ? `This time overlaps an existing ${conflict.type} (${entryLabel(conflict)}). Choose a different time.` : '';
}

function entryLabel(entry) {
  return `${entry.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–${entry.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

async function validateLaptopStart() {
  const now = new Date();
  const conflict = (await entriesForToday()).find(entry => entry.type === 'offline study' && now >= entry.start && now < entry.end);
  return conflict ? `A top-up already covers the current time (${entryLabel(conflict)}). End it or start the laptop session after that time.` : '';
}

document.addEventListener('click', event => {
  const button = event.target.closest('button.primary');
  if (!button || button.dataset.overlapApproved) { if (button?.dataset.overlapApproved) delete button.dataset.overlapApproved; return; }
  const topup = button.closest('form.topup');
  const timer = button.closest('form.modal:not(.topup)');
  if (!topup && !timer) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  (async () => {
    try {
      const error = topup ? await validateTopup(topup) : await validateLaptopStart();
      if (error) { window.alert(error); return; }
      button.dataset.overlapApproved = 'true';
      button.click();
    } catch (error) {
      window.alert(`Could not validate the study time. Please try again. (${error.message})`);
    }
  })();
}, true);
