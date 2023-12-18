import {
  DocumentData,
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
import { firebaseService } from "../server.js";

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
    const docRef = await addDoc(collection(firebaseService.database, "auth_users",), {
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
 * @param targetEmail A string of the target email.
 * @description Gets the target email from the initialized database Auth Users. 
 * @returns If there exist an email in the database containing the target email it will be returned. Else null will be sent.
 */
export async function getAuthenticationUserFromEmail(targetEmail: string): Promise<DocumentData | null> {
  try {
    const q = query(collection(firebaseService.database, "auth_users"), where("email", "==", targetEmail));
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
    const docRef = await addDoc(collection(firebaseService.database, "refresh_tokens"), {
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
    
    const q = query(collection(firebaseService.database, "refresh_tokens"), where("refreshToken", "==", refreshToken));
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
