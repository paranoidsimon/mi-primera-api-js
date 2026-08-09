import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "./config.js";
import UserMongo from "./mongo-db/user_mongo.js";

const [user_name = "admin", password = "1234", display_name = "Administrador", email = "admin@example.com", role = "admin"] = process.argv.slice(2);

async function main() {
  await mongoose.connect(config.dbConnection);
  console.log("Conectado a MongoDB:", config.dbConnection);

  const existing = await UserMongo.findOne({ user_name });
  if (existing) {
    console.log(`El usuario '${user_name}' ya existe.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserMongo.create({
    user_name,
    password: hashedPassword,
    display_name,
    email,
    role,
  });

  console.log("Usuario admin creado correctamente:", {
    id: user._id,
    user_name: user.user_name,
    display_name: user.display_name,
    email: user.email,
    role: user.role,
  });
  process.exit(0);
}

main().catch((error) => {
  console.error("Error creando el usuario admin:", error);
  process.exit(1);
});
