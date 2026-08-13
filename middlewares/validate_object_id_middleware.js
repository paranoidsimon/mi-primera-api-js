import mongoose from "mongoose";

export default function validateObjectIdMiddleware(paramName = "id") {
    return function (req, res, next) {
        const value = req.params[paramName];

        if (!value || !mongoose.isValidObjectId(value)) {
            return res.status(400).json({ error: `Invalid ${paramName} id` });
        }

        next();
    };
}
