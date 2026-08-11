export class ProductMockup {
    products = [
        { id: 1, name: "Laptop", price: 1000, stock: 5 },
        { id: 2, name: "Mouse", price: 20, stock: 10 }
    ];

    getList() {
        return this.products;
    }

    add(product) {
        product.id = this.products.length + 1;
        this.products.push(product);
        return product;
    }

    delete(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return null;
        const [deleted] = this.products.splice(index, 1);
        return deleted;
    }
}
