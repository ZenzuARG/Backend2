import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export default class AuthService {
  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  static comparePassword(password, hashed) {
    return bcrypt.compareSync(password, hashed);
  }

  static signToken(payload, expiresIn = config.JWT_EXPIRES_IN || "1d") {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
  }

  static verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
  }

  static setAuthCookie(res, token) {
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // en prod: true + https
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    });
  }
}
