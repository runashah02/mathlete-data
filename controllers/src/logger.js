const winston = require('winston');
const path = require('path');

// Define your log configuration
const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: path.join(__dirname, 'logs', 'error.log'),
            level: 'error',
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json()
            )
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
    'exitOnError': false,
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

module.exports = logger;
