import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // Make sure to replace this with your actual service account key path
  const serviceAccount = process.env.FIREBASE_ADMIN_SDK_KEY
    ? JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY)
    : undefined;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

export const adminDb = admin.firestore();
export default admin;
