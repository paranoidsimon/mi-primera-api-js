import { getDependency } from "../dependency.js";
import checkRoleMiddleware from "../middlewares/check_role_middleware.js";
import mongoose from "mongoose";

export function configureUserRouter(router) {
    const userService = getDependency("userService");

    console.log("Configurando rutas de usuarios...");
    router.get("/users", checkRoleMiddleware(["admin"]), async (req, res) => {
        const users = await userService.getList();
        res.json(users.map(user => ({ 
            username: user.user_name,
            displayName: user.display_name,
            email: user.email,
            role: user.role,
        })));
    });

    router.post("/users", checkRoleMiddleware(["admin"]), async (req, res) => {
        const user = await getDependency("userService").add(req.body);
        if (!user) return res.status(409).json({ error: "Usuario ya existe" });
        res.status(201).json({ id: user.id, name: user.name });
    });

    router.put("/users/:id", checkRoleMiddleware(["admin"]), async (req, res) => {
        const userService = getDependency("userService");
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        const updatedUser = await userService.update(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ id: updatedUser.id, name: updatedUser.name });
    });

    router.delete("/users/:id", checkRoleMiddleware(["admin"]), async (req, res) => {
        const userService = getDependency("userService");
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        const deletedUser = await userService.delete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "Usario eliminado", name: deletedUser.name });
    });
}
