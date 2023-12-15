import {
  SnapshotOptions,
  addDoc,
  collection,
  deleteDoc,
  doc,
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
  id: string,
  email: string,
  hashedPassword: string
): Promise<void> {
  try {
    const docRef = await addDoc(collection(db, "auth_users",), {
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
    const q = query(collection(db, "auth_users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs[0] != undefined ? querySnapshot.docs[0].data() : null
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
 * @param refreshToken 
 * @description Adds a refresh token to the database.
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

/**
 *
 * @param refreshToken
 * @description Deletes the refresh token from the database.
 */
export async function deleteRefreshTokenFromDatabase(refreshToken: string): Promise<void> {
  try {
    
    const q = query(collection(db, "refresh_tokens"), where("refreshToken", "==", refreshToken));
    const querySnapshot = await getDocs(q)

    await deleteDoc(querySnapshot.docs[0].ref)
  } catch (e) {
    console.error("Error adding document: ", e);
    throw {
      error: "database",
      code: 500,
      payload: "Error when retrieving data from Database",
    };
  }
}
