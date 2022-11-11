import "reflect-metadata";
import "dotenv/config";
import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import {RouteConfig} from './routes/route.config';
import {ProductsRouteConfig} from './routes/products.route.config';
import {Logger} from './services/logger';
import {DatabaseManager} from './services/database-manager';
import {Server, createServer} from 'http';
import Container from 'typedi';
import {PaymentsRouteConfig} from './routes/payments.route.config';

const PORT = process.env.PORT || 3002;

const app: Application = express();
const server: Server = createServer(app);
const databaseManager: DatabaseManager = Container.get(DatabaseManager);
const logger: Logger = Container.get(Logger);

app.use(express.json());
app.use(cors());

const routes: Array<RouteConfig> = [];
routes.push(new ProductsRouteConfig(app));
routes.push(new PaymentsRouteConfig(app));

const runningMessage = `Server running at http://localhost:${PORT}`;
app.get('/', (req: Request, res: Response) => {
    res.status(200).send(runningMessage)
});

databaseManager.connect().then(() =>
    server.listen(PORT, () => {
        logger.info(runningMessage);
    })
);
