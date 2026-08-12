import { getDependency } from "../dependency.js";

export class PurchaseService {
    constructor() {
        this.purchaseRepo = getDependency("purchaseRepo");
        this.cartRepo = getDependency("cartRepo");
    }

    async getByUser(userName) {
        return await this.purchaseRepo.find({ user_name: userName }).sort({ createdAt: -1 });
    }

    async checkout(userName) {
        const cart = await this.cartRepo.findOne({ user_name: userName });
        if (!cart || cart.items.length === 0) {
            throw new Error("El carrito está vacío");
        }

        const purchase = await this.purchaseRepo.create({
            user_name: userName,
            items: cart.items.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            total: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: "completed",
        });

        cart.items = [];
        cart.updatedAt = new Date();
        await cart.save();

        return purchase;
    }
}
