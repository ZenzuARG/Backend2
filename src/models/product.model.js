import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    code: { type: String, required: true, unique: true, index: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    thumbnails: { type: [String], default: [] },

    // Para profundizar roles en compras (opcional pero útil)
    owner: { type: String, default: "admin" } // email del owner o "admin"
  },
  { timestamps: true }
);

export default mongoose.model(productCollection, productSchema);
