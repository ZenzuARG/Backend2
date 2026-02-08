import ticketModel from "../../models/ticket.model.js";

export default class TicketDAO {
  async create(data) {
    const created = await ticketModel.create(data);
    return created.toObject();
  }

  async getByCode(code) {
    return ticketModel.findOne({ code }).lean();
  }
}
