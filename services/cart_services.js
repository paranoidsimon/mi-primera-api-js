import { getDependency } from "../dependency.js";

export class CartService {
    constructor() {
        this.cartRepo = getDependency("cartRepo");
        this.productRepo = getDependency("productRepo");
    }

    async getByUser(userName) {
        return await this.cartRepo.findOne({ user_name: userName });
    }

    async addItem(userName, item) {
        if (!item || !item.productId) {
            throw new Error("El identificador del producto es obligatorio");
        }

        const quantity = Number(item.quantity ?? 1);
        if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error("La cantidad debe ser mayor a cero");
        }

        const product = await this.productRepo.findById(item.productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        let cart = await this.cartRepo.findOne({ user_name: userName });
        if (!cart) {
            cart = await this.cartRepo.create({ user_name: userName, items: [] });
        }

        const itemIndex = cart.items.findIndex(currentItem => currentItem.productId.toString() === product._id.toString());
        if (itemIndex >= 0) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].name = product.name;
            cart.items[itemIndex].price = product.price;
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity,
            });
        }

        cart.updatedAt = new Date();
        await cart.save();
        return cart;
    }

    async updateItemQuantity(userName, productId, data = {}) {
        const quantity = Number(data.quantity ?? 0);
        if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error("La cantidad debe ser mayor a cero");
        }

        const cart = await this.cartRepo.findOne({ user_name: userName });
        if (!cart) {
            return null;
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
        if (itemIndex === -1) {
            return cart;
        }

        cart.items[itemIndex].quantity = quantity;
        cart.updatedAt = new Date();
        await cart.save();
        return cart;
    }

    async removeItem(userName, productId) {
        const cart = await this.cartRepo.findOne({ user_name: userName });
        if (!cart) {
            return null;
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());
        cart.updatedAt = new Date();
        await cart.save();
        return cart;
    }

    async clear(userName) {
        const cart = await this.cartRepo.findOne({ user_name: userName });
        if (!cart) {
            return null;
        }

        cart.items = [];
        cart.updatedAt = new Date();
        await cart.save();
        return cart;
    }

    getTotal(cart) {
        if (!cart || !Array.isArray(cart.items)) return 0;

        return cart.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity || 0)), 0);
    }
}
