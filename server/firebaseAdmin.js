import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';

config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export { db };
