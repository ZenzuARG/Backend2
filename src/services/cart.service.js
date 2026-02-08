export default class CartService {
  constructor(cartRepository, productRepository) {
    this.carts = cartRepository;
    this.products = productRepository;
  }

  async getCart(cid) {
    const cart = await this.carts.getById(cid);
    if (!cart) {
      const err = new Error("Carrito no encontrado");
      err.statusCode = 404;
      throw err;
    }
    return cart;
  }

  async addProduct(cid, pid, qty = 1) {
    if (!Number.isInteger(qty) || qty < 1) {
      const err = new Error("Cantidad inválida");
      err.statusCode = 400;
      throw err;
    }

    const cart = await this.carts.getById(cid);
    if (!cart) {
      const err = new Error("Carrito no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const product = await this.products.getById(pid);
    if (!product) {
      const err = new Error("Producto no encontrado");
      err.statusCode = 404;
      throw err;
    }

    // products es array de { product, quantity }
    // OJO: si está populate, product puede ser objeto; si no, ObjectId
    const index = cart.products.findIndex((p) => {
      const currentId = typeof p.product === "object" ? String(p.product._id) : String(p.product);
      return currentId === String(pid);
    });

    if (index >= 0) {
      cart.products[index].quantity += qty;
    } else {
      cart.products.push({ product: pid, quantity: qty });
    }

    // Persistimos sin populate para evitar líos
    const plainProducts = cart.products.map((p) => ({
      product: typeof p.product === "object" ? p.product._id : p.product,
      quantity: p.quantity
    }));

    return this.carts.update(cid, { products: plainProducts });
  }
}
