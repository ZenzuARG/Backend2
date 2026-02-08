export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  getByEmail(email) {
    return this.dao.getByEmail(email);
  }

  updateById(id, data) {
    return this.dao.updateById(id, data);
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }

  getAll(filter) {
    return this.dao.getAll(filter);
  }
}
