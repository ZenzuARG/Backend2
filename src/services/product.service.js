export default class ProductService {
  constructor(productRepository) {
    this.products = productRepository;
  }

  async list() {
    return this.products.getAll();
  }

  async get(pid) {
    const product = await this.products.getById(pid);
    if (!product) {
      const err = new Error("Producto no encontrado");
      err.statusCode = 404;
      throw err;
    }
    return product;
  }

  async create(data, currentUser) {
    // Validación mínima (lo demás lo valida mongoose)
    const required = ["title", "code", "price", "stock", "category"];
    for (const key of required) {
      if (data[key] === undefined || data[key] === null || data[key] === "") {
        const err = new Error(`Campo requerido faltante: ${key}`);
        err.statusCode = 400;
        throw err;
      }
    }

    const exists = await this.products.getByCode(data.code);
    if (exists) {
      const err = new Error("No fue posible crear el producto");
      err.statusCode = 400;
      throw err;
    }

    // Owner: si después metemos premium, queda listo
    const owner = currentUser?.email || "admin";

    return this.products.create({ ...data, owner });
  }

  async update(pid, data) {
    const product = await this.products.getById(pid);
    if (!product) {
      const err = new Error("Producto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    // Evitamos que te cambien code a uno existente
    if (data.code && data.code !== product.code) {
      const exists = await this.products.getByCode(data.code);
      if (exists) {
        const err = new Error("No fue posible actualizar el producto");
        err.statusCode = 400;
        throw err;
      }
    }

    return this.products.update(pid, data);
  }

  async delete(pid) {
    const product = await this.products.getById(pid);
    if (!product) {
      const err = new Error("Producto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    await this.products.delete(pid);
    return { deleted: true };
  }
}
