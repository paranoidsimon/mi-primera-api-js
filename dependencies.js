import { addDependency } from "./dependency.js";    
import { UserService } from "./services/user_services.js";
import { LoginService } from "./services/login_services.js";
import { SessionService } from "./services/session_services.js";
import { ProductService } from "./services/product_services.js";
import { CartService } from "./services/cart_services.js";
import { PurchaseService } from "./services/purchase_services.js";
import UserMongo from "./mongo-db/user_mongo.js";
import SessionMongo from "./mongo-db/sessions_mongo.js";
import ProductMongo from "./mongo-db/product_mongo.js";
import CartMongo from "./mongo-db/cart_mongo.js";
import PurchaseMongo from "./mongo-db/purchase_mongo.js";

addDependency("userRepo", UserMongo);
addDependency("sessionRepo", SessionMongo);
addDependency("productRepo", ProductMongo);
addDependency("cartRepo", CartMongo);
addDependency("purchaseRepo", PurchaseMongo);

addDependency("userService", new UserService());
addDependency("loginService", new LoginService());
addDependency("sessionService", new SessionService());
addDependency("productService", new ProductService());
addDependency("cartService", new CartService());
addDependency("purchaseService", new PurchaseService());