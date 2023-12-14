import express, { json } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
var app = express();
//middleware
app.use(bodyParser.json({ limit: "30mb" }));

export const server = app.listen(process.env.AUTH_SERVER_PORT, async () => {
  console.log(
    `🔐 Authentication server is now running at http://localhost:${process.env.AUTH_SERVER_PORT}/`
  );
});

server.on("request", (req, res) => {
  let ipAdress = req.headers["x-forwarded-for"];

  console.log(
    `🔐 AUTH SERVER REQUEST -`,
    req.method,
    req.url,
    "from",
    ipAdress
  );
});
