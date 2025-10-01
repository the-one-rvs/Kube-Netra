import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.info({
            message: "Incoming request",
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime: `${duration}ms`,
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "unknown"
        });
    });

    next();
};

export default requestLogger;
