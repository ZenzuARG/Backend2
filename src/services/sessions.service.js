import crypto from "crypto";
import { config } from "../config/env.js";
import UserService from "./user.service.js";
import MailService from "./mail.service.js";
import AuthService from "./auth.service.js";
import PasswordResetRepository from "../repositories/passwordReset.repository.js"; // si lo creaste

export default class SessionsService {
  static async forgotPassword(email) {
    const user = await UserService.getByEmail(email);

    // Respuesta “blindada” (no filtra si existe)
    if (!user) return null;

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await PasswordResetRepository.create({
      email,
      token,
      expiresAt,
      used: false,
    });

    const resetUrl = `${config.BASE_URL}/api/sessions/reset-password-link?token=${token}&email=${encodeURIComponent(
      email
    )}`;

    const previewUrl = await MailService.sendPasswordReset({ to: email, resetUrl });
    return previewUrl;
  }

  static async resetPassword({ email, token, password }) {
    const record = await PasswordResetRepository.getValid(email, token);
    if (!record) {
      const err = new Error("Token inválido o expirado");
      err.statusCode = 400;
      throw err;
    }

    await UserService.updatePassword(email, password);
    await PasswordResetRepository.markUsed(record._id);
  }

  static async login({ email, password }, res) {
    const user = await UserService.getByEmail(email);
    if (!user) {
      const err = new Error("Credenciales incorrectas");
      err.statusCode = 401;
      throw err;
    }

    const ok = AuthService.comparePassword(password, user.password);
    if (!ok) {
      const err = new Error("Credenciales incorrectas");
      err.statusCode = 401;
      throw err;
    }

    const token = AuthService.signToken({
      id: user._id,
      email: user.email,
      role: user.role,
      cart: user.cart,
    });

    AuthService.setAuthCookie(res, token);
    return { message: "Login exitoso" };
  }
}
