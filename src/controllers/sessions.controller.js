import SessionsService from "../services/sessions.service.js";

export default class SessionsController {
  static register = async (req, res, next) => {
    try {
      const user = await SessionsService.register(req.body);
      return res.status(201).json({ status: "success", payload: user });
    } catch (err) {
      next(err);
    }
  };

  static login = async (req, res, next) => {
    try {
      const result = await SessionsService.login(req.body, res);
      return res.status(200).json({ status: "success", payload: result });
    } catch (err) {
      next(err);
    }
  };

  static current = async (req, res) => {
    // req.user ya viene del strategy "current"
    return res.status(200).json({ status: "success", payload: req.user });
  };

  static logout = async (req, res) => {
    res.clearCookie("jwt");
    return res.status(200).json({ status: "success", message: "Logout exitoso" });
  };

  static forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const previewUrl = await SessionsService.forgotPassword(email);
      return res.status(200).json({
        status: "success",
        message: "Si el email existe, se envió un enlace de recuperación",
        ...(previewUrl ? { previewUrl } : {}),
      });
    } catch (err) {
      next(err);
    }
  };

  static resetPassword = async (req, res, next) => {
    try {
      await SessionsService.resetPassword(req.body);
      return res.status(200).json({ status: "success", message: "Contraseña actualizada" });
    } catch (err) {
      next(err);
    }
  };
}
