import UserRepository from "../repositories/user.repository.js";
import AuthService from "./auth.service.js";

export default class UserService {
  static async getByEmail(email) {
    return UserRepository.getByEmail(email);
  }

  static async create(data) {
    const hashed = AuthService.hashPassword(data.password);
    return UserRepository.create({ ...data, password: hashed });
  }

  static async updatePassword(email, newPassword) {
    const user = await UserRepository.getByEmail(email);
    if (!user) {
      const err = new Error("Usuario no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const isSame = AuthService.comparePassword(newPassword, user.password);
    if (isSame) {
      const err = new Error("La nueva contraseña no puede ser igual a la anterior");
      err.statusCode = 400;
      throw err;
    }

    const hashed = AuthService.hashPassword(newPassword);
    return UserRepository.updateById(user._id, { password: hashed });
  }
}
