export default async function logMiddleware(req, res, next) {
    const username = req.session?.username || req.session?.user_name || req.session?.user || req.session?.userName || "anonymous";
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} ${req.session ? `(user: ${username})` : "(no auth)"}`);
    next();
}