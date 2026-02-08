export default class CartsController {
  constructor(cartService) {
    this.cartService = cartService;

    this.getCart = this.getCart.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  async getCart(req, res, next) {
    try {
      const cart = await this.cartService.getCart(req.params.cid);
      res.send({ status: "success", payload: cart });
    } catch (err) {
      next(err);
    }
  }

  async addProduct(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const qty = req.body?.quantity ?? 1;

      const updated = await this.cartService.addProduct(cid, pid, Number(qty));
      res.send({ status: "success", payload: updated });
    } catch (err) {
      next(err);
    }
  }
}
