import express, { json } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import * as fs from "fs";
import { authRoutes } from "./routes/auth_routes.js";
import { initializeApp } from "firebase/app";
import helmet from "helmet";
import cors from "cors";
import { collection, getFirestore } from "firebase/firestore";

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

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const authUserRef = collection(db, "auth_user");

var app = express();
//middleware
app.use(bodyParser.json({ limit: "30mb" }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "hello" });
});

app.use("/api/auth", authRoutes);

export const server = app.listen(process.env.AUTH_SERVER_PORT, async () => {

  console.log(
    `AUTH SERVER now running at http://localhost:${process.env.AUTH_SERVER_PORT}/`
  );
  
  console.log(
    `AUTH SERVER Firebase App Initialized at ${firebaseApp.options.databaseURL}`
  );
  
});

//log information
server.on("request", (req, res) => {
  let address = (req.socket.address() as { address: String }).address;
  let log = `🔐 AUTH SERVER REQUEST - ${req.method} ${req.url} from ${address}`;
  console.log(log);
  //   fs.writeFileSync("./logs/auth_request.txt", log);
});
