import TicketRepository from "../repositories/ticket.repository.js";

export default class TicketService {
  static async createTicket({ amount, purchaser }) {
    const code = `TCK-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    const payload = {
      code,
      purchase_datetime: new Date(),
      amount,
      purchaser,
    };

    return TicketRepository.create(payload);
  }
}
