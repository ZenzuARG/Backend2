import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";

const router = Router();

// POST /api/sessions/register
router.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Error interno del servidor"
      });
    }

    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "No fue posible registrar el usuario"
      });
    }

    return res.status(201).send({
      status: "success",
      message: "Usuario registrado correctamente"
    });
  })(req, res, next);
});

// POST /api/sessions/login
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Error interno del servidor"
      });
    }

    if (!user) {
      return res.status(401).send({
        status: "error",
        message: "Credenciales incorrectas"
      });
    }

    const token = generateToken(user);

    return res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "lax"
      })
      .send({
        status: "success",
        message: "Login exitoso"
      });
  })(req, res, next);
});

// GET /api/sessions/current
router.get("/current", (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Error interno del servidor"
      });
    }

    if (!user) {
      return res.status(401).send({
        status: "error",
        message: "No autorizado"
      });
    }

    return res.send({
      status: "success",
      payload: user
    });
  })(req, res, next);
});

export default router;
