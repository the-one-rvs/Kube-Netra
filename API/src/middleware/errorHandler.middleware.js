import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    // console.error(err); 

    logger.error({
        message: err.message || "Internal Server Error",
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        query: req.query,
        params: req.params
    });

    if (err instanceof ApiError) {
        return res.status(err.statusCode || 500).json({
            success: err.success || false,
            message: err.message || "Something went wrong",
            errors: err.errors || []
        });
    }

    // Agar unknown error hai
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: []
    });
};

export default errorHandler;
