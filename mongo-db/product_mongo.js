import mongoose from "mongoose";

export default mongoose.model("products", new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}));
