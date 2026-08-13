import { getDependency } from "../dependency.js";
import checkRoleMiddleware from "../middlewares/check_role_middleware.js";
import requireSessionUserMiddleware from "../middlewares/require_session_user_middleware.js";
import validateObjectIdMiddleware from "../middlewares/validate_object_id_middleware.js";

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

    router.get("/users/me", requireSessionUserMiddleware, async (req, res) => {
        const user = await userService.getByUserName(req.session.username);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            username: user.user_name,
            displayName: user.display_name,
            email: user.email,
            role: user.role,
        });
    });

    router.post("/users", checkRoleMiddleware(["admin"]), async (req, res) => {
        const user = await userService.add(req.body);
        if (!user) return res.status(409).json({ error: "Usuario ya existe" });
        res.status(201).json({ id: user.id, name: user.name });
    });

    router.put("/users/:id", checkRoleMiddleware(["admin"]), validateObjectIdMiddleware("id"), async (req, res) => {
        const updatedUser = await userService.update(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ id: updatedUser.id, name: updatedUser.name });
    });

    router.patch("/users/:id", checkRoleMiddleware(["admin"]), validateObjectIdMiddleware("id"), async (req, res) => {
        const updatedUser = await userService.update(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ id: updatedUser.id, name: updatedUser.name });
    });

    router.delete("/users/:id", checkRoleMiddleware(["admin"]), validateObjectIdMiddleware("id"), async (req, res) => {
        const deletedUser = await userService.delete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "Usario eliminado", name: deletedUser.name });
    });
}
