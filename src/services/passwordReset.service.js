import crypto from "crypto";
import bcrypt from "bcrypt";
import { createTransporter, getPreviewUrl } from "../config/mailer.js";

export default class PasswordResetService {
  constructor(userRepository, config) {
    this.users = userRepository;
    this.config = config;
  }

  async requestReset(email) {
    // Siempre respuesta genérica (anti-enumeración)
    const user = await this.users.getByEmail(email);
    if (!user) {
      return { previewUrl: null };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const ttlMin = Number(this.config.RESET_TOKEN_TTL_MIN || 60);
    const expires = new Date(Date.now() + ttlMin * 60 * 1000);

    await this.users.updateById(user._id, {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: expires,
    });

    const baseUrl = this.config.BASE_URL || `http://localhost:${this.config.PORT || 8080}`;

    // Link simple para demo. En un front real, esto iría a una página HTML.
    const link = `${baseUrl}/api/sessions/reset-password-link?token=${token}&email=${encodeURIComponent(
      email
    )}`;

    const { transporter } = await createTransporter();

    const info = await transporter.sendMail({
      from: this.config.MAIL_FROM || "no-reply@ecommerce.local",
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <h3>Recuperación de contraseña</h3>
        <p>Se solicitó un restablecimiento de contraseña.</p>
        <p>Este enlace expira en ${ttlMin} minutos.</p>
        <p><a href="${link}" target="_blank">Restablecer contraseña</a></p>
        <p>Si no fuiste vos, ignorá este correo.</p>
      `,
    });

    return { previewUrl: getPreviewUrl(info) };
  }

  async resetPassword({ token, email, newPassword }) {
    const genericError = () => {
      const err = new Error("Token inválido o expirado");
      err.statusCode = 400;
      return err;
    };

    const user = await this.users.getByEmail(email);
    if (!user) throw genericError();

    if (!user.resetPasswordToken || !user.resetPasswordExpires) throw genericError();
    if (new Date(user.resetPasswordExpires).getTime() < Date.now()) throw genericError();

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenHash !== user.resetPasswordToken) throw genericError();

    // Evitar misma contraseña anterior
    const same = await bcrypt.compare(newPassword, user.password);
    if (same) {
      const err = new Error("No podés usar la misma contraseña anterior");
      err.statusCode = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.users.updateById(user._id, {
      password: hashed,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return true;
  }
}
