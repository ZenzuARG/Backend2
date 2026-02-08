export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).send({ status: "error", message: "No autorizado" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).send({ status: "error", message: "Prohibido" });
    }

    return next();
  };
};
