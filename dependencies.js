import { addDependency } from "./dependency.js";    
import { UserService } from "./services/user_services.js";
import { LoginService } from "./services/login_services.js";
import { SessionService } from "./services/session_services.js";
import { ProductService } from "./services/product_services.js";
import UserMongo from "./mongo-db/user_mongo.js";
import SessionMongo from "./mongo-db/sessions_mongo.js";
import ProductMongo from "./mongo-db/product_mongo.js";

addDependency("userRepo", UserMongo);
addDependency("sessionRepo", SessionMongo);
addDependency("productRepo", ProductMongo);

addDependency("userService", new UserService());
addDependency("loginService", new LoginService());
addDependency("sessionService", new SessionService());
addDependency("productService", new ProductService());