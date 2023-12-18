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

//Configures the environment variables. Only needs to be called once. Enviroment variables should include: AUTH_SERVER_PORT, MAIN_SERVER_PORT, FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, APP_ID, HASH_SALT, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
dotenv.config();
//Declare the Node.js Express Application.
var authApp = express();
var mainApp = express();

//Applying middleware for security.
authApp = applyMiddleWareConfigurations(authApp);
mainApp = applyMiddleWareConfigurations(mainApp);

//Initialize Firebase to access tools. 
export const firebaseService = initializeDatabase();



// These are the primary routes for the Authentication.
authApp.use("/", authRoutes);
//Main application profile controls. See Documents for details
mainApp.use("/api/profile", profileRoutes)

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
