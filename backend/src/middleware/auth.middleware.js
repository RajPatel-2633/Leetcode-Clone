import { db } from "../libs/db.libs.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/ApiError.utils.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const authMiddleware = async (req, res, next) => {
  try {
//     console.log("Headers:", req.headers);
// console.log("Cookies:", req.cookies);
//     console.log("All cookies:", req.cookies);       // add this
//     console.log("JWT cookie:", req.cookies?.jwt);
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new BadRequestError("Token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    req.user = user;
    next();

  } catch (err) {
    console.log(err);

    if (err.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid JWT"));
    }

    if (err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("JWT expired"));
    }

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