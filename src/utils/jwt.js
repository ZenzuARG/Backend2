import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    role: user.role,
    cart: user.cart
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const cookieExtractor = (req) => {
  if (!req?.cookies) return null;
  return req.cookies.jwt || req.cookies.coderCookieToken || req.cookies.currentUser || null;
};
