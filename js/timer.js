import { db } from './firebase.js';
import { doc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { secondsToClock, todayKey, updateDailyStats } from './utils.js';

let state = null, tickId = null, onChange = () => {};
const keyFor = uid => `studylog-active-${uid}`;
const elapsed = () => !state ? 0 : state.elapsedSeconds + (state.runningSince ? Math.max(0, Math.floor((Date.now() - new Date(state.runningSince).getTime()) / 1000)) : 0);
const persist = () => localStorage.setItem(keyFor(state.uid), JSON.stringify(state));
function emit() { onChange({ ...state, duration: elapsed() }); }
function runTick() { clearInterval(tickId); tickId=setInterval(emit, 1000); emit(); }
export function loadTimer(uid, handler) { onChange=handler; try { state=JSON.parse(localStorage.getItem(keyFor(uid))); } catch { state=null; } if (state?.uid!==uid) state=null; if (state) runTick(); else handler(null); return state; }
export const currentTimer = () => state ? { ...state, duration: elapsed() } : null;
const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2,11)}`;
export async function startTimer(uid, task) { const now=new Date(), id=makeId(), next={uid,id,task:task.trim(),startTime:now.toISOString(),date:todayKey(now),elapsedSeconds:0,runningSince:now.toISOString()}; await setDoc(doc(db,'users',uid,'laptopSessions',id),{task:next.task,startTime:Timestamp.fromDate(now),date:next.date,durationSeconds:0,pausedDuration:0,active:true,createdAt:serverTimestamp()}); state=next; persist(); runTick(); }
export async function pauseTimer() { if (!state?.runningSince) return; state.elapsedSeconds=elapsed(); state.runningSince=null; persist(); await updateDoc(doc(db,'users',state.uid,'laptopSessions',state.id),{durationSeconds:state.elapsedSeconds,pausedDuration:state.elapsedSeconds}); emit(); }
export async function resumeTimer() { if (!state || state.runningSince) return; state.runningSince=new Date().toISOString(); persist(); await updateDoc(doc(db,'users',state.uid,'laptopSessions',state.id),{active:true}); runTick(); }
export async function endTimer() { if (!state) return; const completed={...state,duration:elapsed()}; clearInterval(tickId); const end=new Date(); await updateDoc(doc(db,'users',state.uid,'laptopSessions',state.id),{endTime:Timestamp.fromDate(end),durationSeconds:completed.duration,pausedDuration:completed.elapsedSeconds,active:false,updatedAt:serverTimestamp()}); await updateDailyStats(state.uid,state.date,completed.duration,0,1); localStorage.removeItem(keyFor(state.uid)); state=null; emit(); return completed; }
export { elapsed, secondsToClock };
