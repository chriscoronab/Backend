import winston from "winston";
import config from "../config/config.js";
import __dirname from "../utils.js";

const customLevels = {
    levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
    },
    colors: {
    fatal: "blue",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "cyan",
    debug: "grey"
    }
};

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(winston.format.colorize({ colors: customLevels.colors }), winston.format.simple())
        }),
        new winston.transports.File({
        filename: __dirname + "/utils/errors.log",
        level: "error"
        })
    ]
});

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(winston.format.colorize({ colors: customLevels.colors }), winston.format.simple())
        })
    ]
});

const logger = (req, res, next) => {
    if (config.nodeEnv === "production") {
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    };
    req.logger.info(`[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};

export default logger;