import { getDependency } from "../dependency.js";

export function configureCartRouter(router) {
    const cartService = getDependency("cartService");
    const purchaseService = getDependency("purchaseService");

    router.get("/cart", async (req, res) => {
        if (!req.session || req.session.role === "guest") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const cart = await cartService.getByUser(req.session.username);
        const items = cart?.items ?? [];

        res.json({
            user: req.session.username,
            items,
            total: cartService.getTotal(cart),
        });
    });

    router.post("/cart/items", async (req, res) => {
        if (!req.session || req.session.role === "guest") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const cart = await cartService.addItem(req.session.username, req.body);
            res.status(201).json({
                user: req.session.username,
                items: cart.items,
                total: cartService.getTotal(cart),
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.patch("/cart/items/:productId", async (req, res) => {
        if (!req.session || req.session.role === "guest") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const cart = await cartService.updateItemQuantity(req.session.username, req.params.productId, req.body);
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            res.json({
                user: req.session.username,
                items: cart.items,
                total: cartService.getTotal(cart),
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.delete("/cart/items/:productId", async (req, res) => {
        if (!req.session || req.session.role === "guest") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const cart = await cartService.removeItem(req.session.username, req.params.productId);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json({
            user: req.session.username,
            items: cart.items,
            total: cartService.getTotal(cart),
        });
    });

    router.delete("/cart", async (req, res) => {
        if (!req.session || req.session.role === "guest") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const cart = await cartService.clear(req.session.username);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json({ message: "Carrito vaciado", items: [], total: 0 });
    });

    router.get("/purchases", async (req, res) => {
        if (!req.session || req.session.role === "guest") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const purchases = await purchaseService.getByUser(req.session.username);
        res.json(purchases);
    });

    router.post("/purchases/checkout", async (req, res) => {
        if (!req.session || req.session.role === "guest") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const purchase = await purchaseService.checkout(req.session.username);
            res.status(201).json(purchase);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
