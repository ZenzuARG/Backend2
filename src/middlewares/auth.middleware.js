import passport from "passport";

export const authCurrent = (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).send({
        status: "error",
        message: "No autorizado"
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
};
