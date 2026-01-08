import jwt from "jsonwebtoken";
import { HttpError } from "../helpers.js";

export function authRequired(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return next(new HttpError(401, "Authentication required"));
    };

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: payload.id,
            username: payload.username,
            role: payload.role
        };

        next();

    } catch (err) {
        return next(new HttpError(401, "Invalid or expired token"));
    };
}

export function adminOnly(req, res, next) {
    if (!req.user) {
        return next(new HttpError(401, "Authentication required"));
    }

    if (req.user.role !== "admin") {
        return next(new HttpError(403, "Admin access required"));
    };
    next();
}