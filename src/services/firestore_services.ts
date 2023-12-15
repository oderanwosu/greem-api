import {
  SnapshotOptions,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { authUserRef, db, firebaseApp } from "../index.js";

// Initialize Cloud Firestore and get a reference to the service

/**
 *
 * @param email Email should already met email requirements.
 * @param hashedPassword The password given should be hashed.
 * @description Creates an authentication user inside of the Firebase Firestore.
 */
export async function createAuthenticationUser(
  id: String,
  email: String,
  hashedPassword: String
): Promise<void> {
  try {
    const docRef = await addDoc(authUserRef, {
      id: id,
      email: email,
      password: hashedPassword,
    });

    console.log("Authentication User Created! - ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}

/**
 *
 * @param email Email that will be checked.
 * @description Checks if the passed email is already in use.
 */
export async function getAuthenticationUserFromEmail(email: string) {
  try {
    const q = query(authUserRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs[0].data();
  } catch (e) {
    console.error("Error adding document: ", e);
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}

/**
 *
 * @param email Email that will be checked.
 * @description Checks if the passed email is already in use.
 */
export async function addRefreshTokenToDatabase(refreshToken: string): Promise<void> {
  try {
    const docRef = await addDoc(collection(db, "refresh_tokens"), {
      refreshToken: refreshToken,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}
