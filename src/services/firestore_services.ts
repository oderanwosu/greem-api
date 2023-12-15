import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { DatabaseService } from "../utils/interfaces.js";
import { firebaseService } from "../server.js";

export function initializeDatabase(): DatabaseService {
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
  };
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);

  return { serviceApplication: firebaseApp, database: db };
}


export async function getUserAccountByID(id: string) {
  try {
    const q = query(collection(firebaseService.database, "users"), where("id", "==", id));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.length >= 0 ? querySnapshot.docs[0].data() : null;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}
