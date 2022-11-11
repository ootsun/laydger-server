import mongoose from 'mongoose';
import {Container, Service} from 'typedi';
import {Logger} from './logger';

const MONGODB_URI = process.env.MONGODB_URI;

@Service()
export class DatabaseManager {

    private logger: Logger;

    constructor() {
        this.logger = Container.get(Logger);
    }

    async connect() {
        if (!MONGODB_URI) {
            throw new Error('Please define the MONGODB_URI environment variable');
        }
        this.logger.info('Initializing database connection...');
        try {
            await mongoose.connect(MONGODB_URI);
            this.logger.info('Initializing database connection done.');
        } catch (e) {
            this.logger.error('Failed to initialize the database connection :');
            this.logger.error(e);
            this.logger.warn('Exiting program');
            process.exit(0);
        }
    }

    async disconnect() {
        this.logger.info('Closing database connection...');
        try {
            await mongoose.disconnect();
            this.logger.info('Closing database connection done.');
        } catch (e) {
            this.logger.error('Failed to close the database connection :');
            this.logger.error(e);
            this.logger.warn('Exiting program');
            process.exit(0);
        }
    }
}
