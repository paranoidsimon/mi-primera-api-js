import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
}, { _id: false });

export default mongoose.model("purchases", new mongoose.Schema({
    user_name: { type: String, required: true },
    items: [purchaseItemSchema],
    total: { type: Number, required: true },
    status: { type: String, default: "completed" },
    createdAt: { type: Date, default: Date.now }
}));
