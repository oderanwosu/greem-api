import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { initializeApp } from "firebase/app";
import { AnyObject, DatabaseService, UserProfile } from "../utils/interfaces.js";
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

export async function getUserProfileByID(id: string) {
  try {
    const q = query(
      collection(firebaseService.database, "user_profiles"),
      where("id", "==", id)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}

export async function getUserProfileByProfileID(id: string) {
  try {
    const q = query(
      collection(firebaseService.database, "user_profiles"),
      where("data.id", "==", id)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}

export async function getUserProfileByUsername(username: string) {
  try {
    const q = query(
      collection(firebaseService.database, "user_profiles"),
      where("data.username", "==", username)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}

export async function createUserProfile(
  id: string,
  email: string,
  username: string,
  dob: string
) {
  try {
    const docRef = await addDoc(
      collection(firebaseService.database, "user_profiles"),
      {
        isEmailPublic: false,
        isActivityPublic: true,
        isDOBPublic: false,
        authID: id,
        profile: {
          profileID: uuidv4(),
          email: email,
          username: username,
          dob: dob,
          active: false,
        },
        createdAt: new Date().toUTCString(),
      }
    );
  } catch (error) {
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}

export async function updateUserProfile(
  authID: string,
  options: {
    username: string;
    biography: string;
    isActivityPublic: boolean;
    isDOBPublic: boolean;
    isEmailPublic: boolean;
  }
) {
  try {
    const q = query(
      collection(firebaseService.database, "user_profiles"),
      where("authID", "==", authID)
    );
    const querySnapshot = await getDocs(q);

    var data = querySnapshot.docs[0].data()
    
    data.profile.username = options.username || data.profile.username
    data.isActivityPublic = options.isActivityPublic || data.isActivityPublic
    data.isDOBPublic = options.isDOBPublic || data.isDOBPublic
    data.isEmailPublic = options.isEmailPublic || data.isEmailPublic
      console.log(data)
    await setDoc(querySnapshot.docs[0].ref, data)

  } catch (error) {
    console.log(error);
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}

