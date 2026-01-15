import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";
import { cookieExtractor } from "../utils/jwt.js";

export const initializePassport = () => {
  // REGISTER
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          if (!first_name || !last_name || !email || !age || !password) {
            return done(null, false);
          }

          const exists = await userModel.findOne({ email });
          if (exists) return done(null, false);

          const newCart = await cartModel.create({ products: [] });

          const user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
            role: "user"
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // LOGIN
  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) return done(null, false);

        if (!isValidPassword(user, password)) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // JWT CURRENT
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (jwtPayload, done) => {
        try {
          const user = await userModel.findById(jwtPayload._id).lean();
          if (!user) return done(null, false);

          delete user.password;
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};
