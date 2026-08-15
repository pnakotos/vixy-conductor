import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const appConfig = firebaseConfig as FirebaseOptions & { firestoreDatabaseId?: string };

// Initialize Firebase App
const app = !getApps().length ? initializeApp(appConfig) : getApp();

// Export auth and database
export const auth = getAuth(app);
export const db = getFirestore(app, appConfig.firestoreDatabaseId || '(default)');

// Connection test helper
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const snapshot = await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore initialized and connected successfully.', snapshot.exists());
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('offline') || message.includes('network')) {
      console.warn('Firebase offline or network issue detected.');
    } else {
      console.warn('Firebase connection test warning:', message);
    }
    return false;
  }
}
