import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
          quantity: { type: Number, default: 1, min: 1 }
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model(cartCollection, cartSchema);
