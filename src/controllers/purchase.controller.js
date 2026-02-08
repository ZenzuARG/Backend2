export default class PurchaseController {
  constructor(purchaseService) {
    this.purchaseService = purchaseService;
    this.purchase = this.purchase.bind(this);
  }

  async purchase(req, res, next) {
    try {
      const { cid } = req.params;
      const email = req.user?.email;

      const result = await this.purchaseService.purchase(cid, email);

      res.send({
        status: "success",
        payload: result
      });
    } catch (err) {
      next(err);
    }
  }
}
