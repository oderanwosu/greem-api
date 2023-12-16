import { Response } from "express";
import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore";

export interface authUser {
  id: string;
  email: string;
}
export interface AuthenticatedResponse extends Response {
  authUser?: authUser;
}
export interface APIError {
  error: string;
  code: number;
  payload: any;
}

export interface DatabaseService {
  database: Firestore;
  serviceApplication: FirebaseApp;
}

export interface UserProfile extends Profile{

  isEmailPublic: boolean,
  isActivityPublic: boolean,
  isDOBPublic: boolean,
  authID: string
  createdAt: string,
}

export interface AnyObject {
  [key: string]: any;
}

export interface Profile {
  profileID?: string,
  email?: string,
  username?: string,
  dob?: string,
  active?: boolean
}


