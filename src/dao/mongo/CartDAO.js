import cartModel from "../../models/cart.model.js";

export default class CartDAO {
  async getById(id) {
    return cartModel.findById(id).populate("products.product").lean();
  }

  async create(data = {}) {
    const created = await cartModel.create(data);
    return created.toObject();
  }

  async update(id, data) {
    await cartModel.updateOne({ _id: id }, data);
    return this.getById(id);
  }
}
