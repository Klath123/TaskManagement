import admin from 'firebase-admin';

let db, auth; // declare at module level

export const initializeFirebase = () => {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  db = admin.firestore();
  auth = admin.auth();
};

export const getDb = () => {
  if (!db) throw new Error("Firestore not initialized. Call initializeFirebase() first.");
  return db;
};

export const getAuth = () => {
  if (!auth) throw new Error("Auth not initialized. Call initializeFirebase() first.");
  return auth;
};

export const getFieldValue = () => admin.firestore.FieldValue;
