export default class PasswordResetController {
  constructor(service) {
    this.service = service;

    this.forgot = this.forgot.bind(this);
    this.reset = this.reset.bind(this);
    this.resetLink = this.resetLink.bind(this);
  }

  async forgot(req, res, next) {
    try {
      const { email } = req.body;

      const { previewUrl } = await this.service.requestReset(email);

      res.send({
        status: "success",
        message: "Si el email existe, se envió un enlace de recuperación",
        previewUrl, // para demo con Ethereal
      });
    } catch (err) {
      next(err);
    }
  }

  async reset(req, res, next) {
    try {
      const { email, token, password } = req.body;

      await this.service.resetPassword({
        email,
        token,
        newPassword: password,
      });

      res.send({ status: "success", message: "Contraseña actualizada" });
    } catch (err) {
      next(err);
    }
  }

  // endpoint “de demo” para ver el token fácil desde el navegador
  // (en un proyecto real esto sería una página del front)
  async resetLink(req, res) {
    const { token, email } = req.query;

    res.status(200).send(`
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h2>Reset Password (Demo)</h2>
          <p>Copiá estos valores y pegarlos en Postman:</p>
          <pre>email: ${email}</pre>
          <pre>token: ${token}</pre>
          <p>Luego llamá al endpoint:</p>
          <pre>POST /api/sessions/reset-password</pre>
          <pre>{
  "email": "${email}",
  "token": "${token}",
  "password": "NuevaPassword123"
}</pre>
        </body>
      </html>
    `);
  }
}
