import {AbstractRouteConfig} from './abstract.route.config';
import {Application, Request, Response} from 'express';
import Container from 'typedi';
import {ProductsController} from '../controllers/products.controller';
import {CreatePaymentCommand} from '../models/commands/create-payment.command';
import {Logger} from '../services/logger';
import {ProductDto} from '../models/dtos/product.dto';

export class ProductsRouteConfig extends AbstractRouteConfig {

    private logger: Logger;
    constructor(app: Application) {
        super(app, 'ProductsRoutes');
        this.logger = Container.get(Logger);
    }

    configureRoutes() {
        const productsController = Container.get(ProductsController);
        this.app.route(`/products`)
            .get(async (req: Request, res: Response) => {
                const products: ProductDto[] = await productsController.getAllProducts();
                res.status(200).json(products);
            });
        return this.app;
    }
}
