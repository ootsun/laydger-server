import { format } from 'logform';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import {Service} from 'typedi';

const LOG_LEVEL = process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : 'debug';
const LOG_DIR = process.env.LOG_DIR || 'log';
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : null;

@Service()
export class Logger {

    private logger: winston.Logger;

    constructor() {
        let logDir = LOG_DIR;
        if (!logDir.endsWith('/')) {
            logDir += '/';
        }

        this.logger = winston.createLogger({
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss:SSS',
                }),
                format.errors({ stack: true }),
                format.splat(),
                format.json(),
                format.printf(
                    (info) => `${info.timestamp} [${info.level}] ${info.message}`,
                ),
            ),
            transports:
                NODE_ENV !== 'production'
                    ? [new winston.transports.Console({ level: LOG_LEVEL })]
                    : [
                        new winston.transports.Console(),
                        new DailyRotateFile({
                            filename: logDir + 'error.log',
                            datePattern: 'YYYY-MM-DD',
                            maxFiles: '31d',
                            level: 'error',
                        }),
                        new DailyRotateFile({
                            filename: logDir + 'combined.log',
                            datePattern: 'YYYY-MM-DD',
                            maxFiles: '31d',
                            level: LOG_LEVEL,
                        }),
                    ],
        });
    }

    debug(message: any) {
        this.logger.debug(message);
    }

    info(message: any) {
        this.logger.info(message);
    }

    warn(message: any) {
        this.logger.warn(message);
    }

    error(message: any) {
        this.logger.error(message);
    }
}
