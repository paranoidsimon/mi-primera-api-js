import { getDependency } from "../dependency.js";
import checkRoleMiddleware from "../middlewares/check_role_middleware.js";
import validateObjectIdMiddleware from "../middlewares/validate_object_id_middleware.js";

export function configureProductRouter(router) {
    const productService = getDependency("productService");

    console.log("Configurando rutas de productos...");

    router.get("/products", checkRoleMiddleware(["admin", "user"]), async (req, res) => {
        const products = await productService.getList();
        res.json(products.map(product => ({
            name: product.name,
            price: product.price,
            description: product.description,
            stock: product.stock,
        })));
    });

    router.post("/products", checkRoleMiddleware(["admin"]), async (req, res) => {
        const product = await productService.add(req.body);
        if (!product) return res.status(409).json({ error: "Producto ya existe" });
        res.status(201).json(product);
    });

    router.put("/products/:id", checkRoleMiddleware(["admin"]), validateObjectIdMiddleware("id"), async (req, res) => {
        const updatedProduct = await productService.update(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(updatedProduct);
    });

    router.patch("/products/:id", checkRoleMiddleware(["admin"]), validateObjectIdMiddleware("id"), async (req, res) => {
        const updatedProduct = await productService.update(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(updatedProduct);
    });

    router.delete("/products/:id", checkRoleMiddleware(["admin"]), validateObjectIdMiddleware("id"), async (req, res) => {
        const deletedProduct = await productService.delete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Producto eliminado", id: deletedProduct._id });
    });
}
