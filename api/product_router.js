import { getDependency } from "../dependency.js";
import checkRoleMiddleware from "../middlewares/check_role_middleware.js";
import mongoose from "mongoose";

export function configureProductRouter(router) {
    const productService = getDependency("productService");

    console.log("Configurando rutas de productos...");

    router.get("/products", async (req, res) => {
        const products = await productService.getList();
        res.json(products);
    });

    router.post("/products", checkRoleMiddleware(["admin"]), async (req, res) => {
        const product = await productService.add(req.body);
        if (!product) return res.status(409).json({ error: "Producto ya existe" });
        res.status(201).json(product);
    });

    router.put("/products/:id", checkRoleMiddleware(["admin"]), async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid product id" });
        }

        const updatedProduct = await productService.update(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(updatedProduct);
    });

    router.delete("/products/:id", checkRoleMiddleware(["admin"]), async (req, res) => {
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
