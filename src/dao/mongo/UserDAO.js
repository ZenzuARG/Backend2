import userModel from "../../models/user.model.js";

export default class UserDAO {
  async create(data) {
    const created = await userModel.create(data);
    return created.toObject();
  }

  async getById(id) {
    return userModel.findById(id).lean();
  }

  async getByEmail(email) {
    return userModel.findOne({ email }).lean();
  }

  async updateById(id, data) {
    const result = await userModel.updateOne(
      { _id: id },
      { $set: data }
    );
    return result;
  }

  async deleteById(id) {
    const result = await userModel.deleteOne({ _id: id });
    return result;
  }

  async getAll(filter = {}) {
    return userModel.find(filter).lean();
  }
}
