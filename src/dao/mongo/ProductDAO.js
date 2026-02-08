import productModel from "../../models/product.model.js";

export default class ProductDAO {
  async getAll(filter = {}, options = {}) {
    return productModel.find(filter).lean();
  }

  async getById(id) {
    return productModel.findById(id).lean();
  }

  async getByCode(code) {
    return productModel.findOne({ code }).lean();
  }

  async create(data) {
    const created = await productModel.create(data);
    return created.toObject();
  }

  async update(id, data) {
    await productModel.updateOne({ _id: id }, data);
    return this.getById(id);
  }

  async delete(id) {
    return productModel.deleteOne({ _id: id });
  }

  async decreaseStock(id, qty) {
  return productModel.updateOne(
    { _id: id, stock: { $gte: qty } },
    { $inc: { stock: -qty } }
  );
}

}
