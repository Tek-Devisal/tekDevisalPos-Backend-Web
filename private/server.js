const cron = require("node-cron");
const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
require("dotenv").config();
const routes = require("../routes/v1/routes");
const localURI = "mongodb://localhost/tekdevisalPOS";
const keys = require("../keys.json");

const app = express();

app.set("keys", keys.tekdevisalPOS);
require("./database/mongodb")(app.get("keys").db_name);

// Using CORS
app.use(cors());

//send post requests
app.use(express.json());

const DB_NAME = "myPOS";
const ARCHIVE_PATH = path.join(__dirname, "public");

function backupMongoDB() {
  const child = spawn("mongodump", ["--db", `${DB_NAME}`]);

  child.stdout.on("data", (data) => {
    console.log("stdout:\n", data);
  });
  child.stderr.on("data", (data) => {
    console.log("stderr:\n", Buffer.from(data).toString());
  });
  child.on("error", (error) => {
    console.log("error:\n", error);
  });
  child.on("exit", (code, signal) => {
    if (code) console.log("Process exit with code:", code);
    else if (signal) console.log("Process killed with signal:", signal);
    else console.log("Backup is successfull ✅");
  });
}

// RESTORE BACKUP TO ATLAS
function restoreBackup() {
  const child = spawn("mongorestore", [
    "--uri",
    "mongodb+srv://tekdevisal:Frimpong2010@cluster0.0dlsllz.mongodb.net",
  ]);

  child.stdout.on("data", (data) => {
    console.log("stdout:\n", data);
  });
  child.stderr.on("data", (data) => {
    console.log("stderr:\n", Buffer.from(data).toString());
  });
  child.on("error", (error) => {
    console.log("error:\n", error);
  });
  child.on("exit", (code, signal) => {
    if (code) console.log("Process exit with code:", code);
    else if (signal) console.log("Process killed with signal:", signal);
    else console.log("Restore is successfull ✅");
  });
}

//Route middleware

// cron.schedule("*/5 * * * *", () => backupMongoDB());

// cron.schedule("*/10 * * * * *", () => restoreBackup());

// mongorestore --uri mongodb+srv://tekdevisal:<PASSWORD>@cluster0.0dlsllz.mongodb.net

app.use("", routes);
if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 3001, () =>
    console.log("Server running on port 3001")
  );
}

module.exports = app;
