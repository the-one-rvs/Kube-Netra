import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    console.error(err); 

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
