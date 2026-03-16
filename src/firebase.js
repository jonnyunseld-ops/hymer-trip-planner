import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get } from 'firebase/database';

// Firebase config – set these in Netlify Environment Variables
// or replace directly here for testing
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app = null;
let db = null;

const isConfigured = firebaseConfig.apiKey && firebaseConfig.databaseURL;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  } catch (e) {
    console.warn('Firebase init failed:', e);
  }
}

const ROOM = 'hymer-team'; // shared room for John & Vanessa

export function subscribeToData(path, callback) {
  if (!db) return () => {};
  const dbRef = ref(db, `${ROOM}/${path}`);
  const unsub = onValue(dbRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsub;
}

export function saveData(path, data) {
  if (!db) return Promise.resolve();
  const dbRef = ref(db, `${ROOM}/${path}`);
  return set(dbRef, data);
}

export function loadData(path) {
  if (!db) return Promise.resolve(null);
  const dbRef = ref(db, `${ROOM}/${path}`);
  return get(dbRef).then(s => s.val());
}

export { db, isConfigured };
