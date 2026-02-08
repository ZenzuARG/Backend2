const generateCode = () => {
  // simple y suficiente para el TP: TCK-YYYYMMDD-xxxxx
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TCK-${y}${m}${d}-${rand}`;
};

export default class PurchaseService {
  constructor(cartRepository, productRepository, ticketRepository) {
    this.carts = cartRepository;
    this.products = productRepository;
    this.tickets = ticketRepository;
  }

  async purchase(cid, purchaserEmail) {
    const cart = await this.carts.getById(cid);
    if (!cart) {
      const err = new Error("Carrito no encontrado");
      err.statusCode = 404;
      throw err;
    }

    if (!cart.products || cart.products.length === 0) {
      const err = new Error("El carrito está vacío");
      err.statusCode = 400;
      throw err;
    }

    // armamos arrays para: comprados y no comprados
    const purchased = [];
    const notPurchased = [];

    let totalAmount = 0;

    // Recorremos productos del carrito
    for (const item of cart.products) {
      const productObj = item.product; // viene populate
      const pid = productObj?._id || item.product;
      const qty = item.quantity;

      // si no vino populate por algo, lo traemos
      let product = productObj;
      if (!product || !product._id) {
        product = await this.products.getById(pid);
      }

      if (!product) {
        // producto borrado? lo tratamos como no comprado
        notPurchased.push({ product: pid, quantity: qty, reason: "Producto inexistente" });
        continue;
      }

      // chequeo stock
      if (product.stock >= qty) {
        // intentamos descontar atómico (evita race conditions)
        const result = await this.products.decreaseStock(product._id, qty);

        if (result.modifiedCount === 1) {
          purchased.push({ product: product._id, quantity: qty, price: product.price });
          totalAmount += product.price * qty;
        } else {
          // otro proceso se llevó el stock entre medio
          notPurchased.push({ product: product._id, quantity: qty, reason: "Stock insuficiente" });
        }
      } else {
        notPurchased.push({ product: product._id, quantity: qty, reason: "Stock insuficiente" });
      }
    }

    // Si compró algo -> genera ticket
    let ticket = null;
    if (purchased.length > 0) {
      ticket = await this.tickets.create({
        code: generateCode(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: purchaserEmail
      });
    }

    // El carrito queda solo con los no comprados
    const remainingProducts = notPurchased
      .filter((p) => p.product) // por si
      .map((p) => ({ product: p.product, quantity: p.quantity }));

    await this.carts.update(cid, { products: remainingProducts });

    return {
      ticket,
      purchased,
      notPurchased
    };
  }
}
