import { db } from "../libs/db.libs.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/ApiError.utils.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new BadRequestError("Token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hardened DB call to handle Neon connection flickering
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    }).catch(err => {
        // If DB is unreachable (P1001), log it specifically
        console.error("Database connection error in authMiddleware:", err.message);
        throw new InternalServerError("Service temporarily unavailable. Please try again in a few seconds.");
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err);

    if (err.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid JWT"));
    }

    if (err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("JWT expired"));
    }

    // This catches our custom InternalServerError from the .catch above
    next(err);
  }
};

export const checkAdmin = (req, res, next) => {
  try {
    if (!req.user || !req.user.role) {
      throw new UnauthorizedError("Access Denied");
    }

    if (req.user.role.trim().toLowerCase() !== "admin") {
      throw new UnauthorizedError("Access Denied, only for admins");
    }

    next();
  } catch (err) {
    next(err);
  }
};