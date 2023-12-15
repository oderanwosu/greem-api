import express, { json } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import * as fs from "fs";
import { authRoutes } from "./routes/auth_routes.js";
import { initializeApp } from "firebase/app";
import helmet from "helmet";
import cors from "cors";
import { collection, getFirestore } from "firebase/firestore";
import { applyMiddleWareConfigurations } from "./utils/middleware.js";
import { initializeDatabase } from "./services/firestore_services.js";
import { profileRoutes } from "./routes/profile_routes.js";

dotenv.config();
//web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

var authApp = express();
var mainApp = express();
//middleware
authApp = applyMiddleWareConfigurations(authApp);
mainApp = applyMiddleWareConfigurations(mainApp);
export const firebaseService = initializeDatabase();



authApp.use("/", authRoutes);
mainApp.use("/api/", profileRoutes)

export const authServer = authApp.listen(
  process.env.AUTH_SERVER_PORT,
  async () => {
    console.log(`[${new Date().getDate()}] AUTH SERVER - Running...`);
    console.log(
      "Firebase Application:",
      firebaseService.serviceApplication.name
    );
  }
);

export const mainServer = mainApp.listen(
  process.env.MAIN_SERVER_PORT,
  async () => {
    console.log(`[${new Date().getDate()}] MAIN SERVER - Running...`);
    console.log(
      "Firebase Application:",
      firebaseService.serviceApplication.name
    );
  }
);

//log information
authServer.on("request", (req, res) => {
  let address = (req.socket.address() as { address: String }).address;
  let log = `🔐 AUTH SERVER REQUEST - ${req.method} ${req.url} from ${address}`;
  console.log(log);
  //   fs.writeFileSync("./logs/auth_request.txt", log);
});
//log information
mainServer.on("request", (req, res) => {
  let address = (req.socket.address() as { address: String }).address;
  let log = `[${new Date().getDate()}] MAIN SERVER REQUEST - ${req.method} ${
    req.url
  } from ${address}`;
  console.log(log);
  //   fs.writeFileSync("./logs/auth_request.txt", log);
});
