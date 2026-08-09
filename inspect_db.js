import mongoose from "mongoose";
import config from "./config.js";
import UserMongo from "./mongo-db/user_mongo.js";
import SessionMongo from "./mongo-db/sessions_mongo.js";

async function main() {
  await mongoose.connect(config.dbConnection);
  console.log("Conectado a:", config.dbConnection);
  const users = await UserMongo.find().lean();
  const sessions = await SessionMongo.find().lean();
  console.log("USERS:", JSON.stringify(users, null, 2));
  console.log("SESSIONS:", JSON.stringify(sessions, null, 2));
  await mongoose.disconnect();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
