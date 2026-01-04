// Log Messages utility
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'log/combined.log' })
    ]
});

module.exports = {
    message: function(level, context, code, message) {
        const logMessage = {
            level: level,
            context: context,
            code: code,
            message: message
        };
        logger.info(logMessage);
    },
    info: function(message, code, context) {
        logger.info({ message, code, context });
    },
    error: function(message, url, context) {
        logger.error({ message, url, context });
    },
    db: {
        conError: function(context, msg, code, fatal) {
            logger.error({ type: 'DB_CONNECTION_ERROR', context, msg, code, fatal });
        }
    }
};

