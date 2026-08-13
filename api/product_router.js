import { getDependency } from "../dependency.js";
import checkRoleMiddleware from "../middlewares/check_role_middleware.js";
import mongoose from "mongoose";

export function configureProductRouter(router) {
    const productService = getDependency("productService");

    console.log("Configurando rutas de productos...");

    router.get("/products", async (req, res) => {
        if (!req.session || req.session.role === "guest") {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const products = await productService.getList();
        res.json(products.map(product => ({
            name: product.name,
            price: product.price,
            description: product.description,
            stock: product.stock,
        })));
    });

    router.post("/products", async (req, res) => {
        if (!req.session || req.session.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const product = await productService.add(req.body);
        if (!product) return res.status(409).json({ error: "Producto ya existe" });
        res.status(201).json(product);
    });

    router.put("/products/:id", async (req, res) => {
        if (!req.session || req.session.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid product id" });
        }

        const updatedProduct = await productService.update(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(updatedProduct);
    });

    router.patch("/products/:id", async (req, res) => {
        if (!req.session || req.session.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid product id" });
        }

        const updatedProduct = await productService.update(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(updatedProduct);
    });

    router.delete("/products/:id", async (req, res) => {
        if (!req.session || req.session.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid product id" });
        }

        const deletedProduct = await productService.delete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Producto eliminado", id: deletedProduct._id });
    });
}
