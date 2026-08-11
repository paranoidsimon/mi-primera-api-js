import { getDependency } from "../dependency.js";

export class ProductService {
    constructor() {
        this.productRepo = getDependency("productRepo");
    }

    async getList() {
        return await this.productRepo.find();
    }

    async add(product) {
        if (!product.name)
            throw new Error("El nombre del producto es obligatorio");

        if (!product.price)
            throw new Error("El precio del producto es obligatorio");

        return this.productRepo.create(product);
    }

    async update(id, productData) {
        return this.productRepo.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        return this.productRepo.findByIdAndDelete(id);
    }
}
