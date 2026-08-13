export default function requireSessionUserMiddleware(req, res, next) {
    if (!req.session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const username = req.session.username || req.session.user_name || req.session.user || req.session.userName;

    if (!username) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.session.username = username;
    next();
}
