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

export default async function checkAuthorizationTokenMiddleware(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
        req.session = { role: "guest" };
        return next();
    }

    const sessionService = getDependency("sessionService");
    const session = await sessionService.getByToken(token);

    if (!session) {
        req.session = { role: "guest" };
        return next();
    }

    req.session = session;
    console.log(session);

    next();

}