export default class ProductsController {
  constructor(productService) {
    this.productService = productService;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  async list(req, res) {
    const products = await this.productService.list();
    res.send({ status: "success", payload: products });
  }

  async get(req, res) {
    const product = await this.productService.get(req.params.pid);
    res.send({ status: "success", payload: product });
  }

  async create(req, res) {
    const created = await this.productService.create(req.body, req.user);
    res.status(201).send({ status: "success", payload: created });
  }

  async update(req, res) {
    const updated = await this.productService.update(req.params.pid, req.body);
    res.send({ status: "success", payload: updated });
  }

  async remove(req, res) {
    const result = await this.productService.delete(req.params.pid);
    res.send({ status: "success", payload: result });
  }
}
