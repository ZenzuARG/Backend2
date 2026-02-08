export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll(filter, options) {
    return this.dao.getAll(filter, options);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  getByCode(code) {
    return this.dao.getByCode(code);
  }

  create(data) {
    return this.dao.create(data);
  }

  update(id, data) {
    return this.dao.update(id, data);
  }

  delete(id) {
    return this.dao.delete(id);
  }

  decreaseStock(id, qty) {
  return this.dao.decreaseStock(id, qty);
}

}
