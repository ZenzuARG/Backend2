import nodemailer from "nodemailer";
import { config } from "../config/env.js";

export default class MailService {
  static transporter = nodemailer.createTransport({
    host: config.MAIL_HOST,
    port: Number(config.MAIL_PORT),
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS,
    },
  });

  static async sendPasswordReset({ to, resetUrl }) {
    const info = await this.transporter.sendMail({
      from: config.MAIL_FROM || "no-reply@ecommerce.local",
      to,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Se solicitó un restablecimiento de contraseña.</p>
        <p>Este enlace expira en 60 minutos.</p>
        <p><a href="${resetUrl}">Restablecer contraseña</a></p>
        <p>Si no fuiste vos, ignorá este correo.</p>
      `,
    });

    // Ethereal devuelve preview. En prod puede venir vacío.
    const previewUrl = nodemailer.getTestMessageUrl(info);
    return previewUrl;
  }
}
