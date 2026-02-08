import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true, min: 0 },
    purchaser: { type: String, required: true } // email del usuario
  },
  { timestamps: true }
);

export default mongoose.model(ticketCollection, ticketSchema);
