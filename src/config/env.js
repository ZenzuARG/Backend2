import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 8080),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 8080}`,
  mail: {
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
    from: process.env.MAIL_FROM || process.env.MAIL_USER || ""
  }
};

if (!config.mongoUri) throw new Error("Missing MONGODB_URI in .env");
if (!config.jwtSecret) throw new Error("Missing JWT_SECRET in .env");
