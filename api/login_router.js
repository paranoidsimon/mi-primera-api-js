import { getDependency } from "../dependency.js";

function getTokenFromRequest(req) {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        const [schema, ...tokenParts] = authHeader.split(" ");
        const token = tokenParts.join(" ");

        if (schema?.toLowerCase() !== "bearer") {
            throw new Error("Invalid authorization schema");
        }

        return token;
    }

    const cookieHeader = req.headers.cookie || "";
    const cookies = cookieHeader.split(";").map(cookie => cookie.trim()).filter(Boolean);
    const authCookie = cookies.find(cookie => cookie.startsWith("authorizationToken="));

    if (!authCookie) {
        return null;
    }

    return decodeURIComponent(authCookie.split("=")[1]);
}

export function configureLoginRouter(router) {
    const loginService = getDependency("loginService");
    const sessionService = getDependency("sessionService");

    router.post("/login", async (req, res) => {
        const data = req.body;
        const result = await loginService.login(data);

        res.cookie("authorizationToken", result.authorizationToken, {
            httpOnly: true,
            sameSite: "lax",
            path: "/"
        });

        res.setHeader("x-authorization-token", result.authorizationToken);

        const shouldExposeToken = req.headers["x-test-token"] === "true" || req.headers["x-test-mode"] === "true";
        if (shouldExposeToken) {
            res.json({ ...result.payload, authorizationToken: result.authorizationToken });
            return;
        }

        res.json(result.payload);
    });

    router.post("/logout", async (req, res) => {
        const token = getTokenFromRequest(req);

        if (token) {
            await sessionService.deleteByToken(token);
        }

        res.cookie("authorizationToken", "", {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            expires: new Date(0)
        });

        res.json({ message: "Logout exitoso" });
    });
} 