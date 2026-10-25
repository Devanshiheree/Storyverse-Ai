
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check which configuration values are loaded
console.table({
  apiKey: Boolean(firebaseConfig.apiKey),
  authDomain: Boolean(firebaseConfig.authDomain),
  projectId: Boolean(firebaseConfig.projectId),
  storageBucket: Boolean(firebaseConfig.storageBucket),
  messagingSenderId: Boolean(firebaseConfig.messagingSenderId),
  appId: Boolean(firebaseConfig.appId),
});
console.log(
  'Firebase API key length:',
  firebaseConfig.apiKey?.length
);

console.log(
  'Firebase API key prefix:',
  firebaseConfig.apiKey?.slice(0, 6)
);

// Stop if required values are missing
const missingFields = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

console.log('Missing Firebase fields:', missingFields);

if (missingFields.length > 0) {
  throw new Error(
    `Missing Firebase fields: ${missingFields.join(', ')}`
  );
}
console.log('Firebase config status:', {
  apiKey: Boolean(firebaseConfig.apiKey),
  authDomain: Boolean(firebaseConfig.authDomain),
  projectId: Boolean(firebaseConfig.projectId),
  appId: Boolean(firebaseConfig.appId),
  messagingSenderId: Boolean(firebaseConfig.messagingSenderId),
});

// Initialize Firebase
const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
