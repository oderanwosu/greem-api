import express, { json } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import * as fs from "fs";

dotenv.config();
var app = express();
//middleware
app.use(bodyParser.json({ limit: "30mb" }));

app.get("/", (req, res) => {
  res.send({ message: "hello" });
});

export const server = app.listen(process.env.AUTH_SERVER_PORT, async () => {
  console.log(
    `AUTH SERVER server is now running at http://localhost:${process.env.AUTH_SERVER_PORT}/`
  );
});

//log information 
server.on("request", (req, res) => {
  let address = (req.socket.address() as { address: String }).address;
  let log = `🔐 AUTH SERVER REQUEST - ${req.method} ${req.url} from ${address}`;
  console.log(log);
//   fs.writeFileSync("./logs/auth_request.txt", log);
});
