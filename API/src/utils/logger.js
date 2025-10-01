import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // ELK stack ke liye JSON log
    ),
    transports: [
        new winston.transports.Console() // Docker/Pod logs me nikalne ke liye
    ],
});

export default logger;
