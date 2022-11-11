import {Application} from 'express';

export interface RouteConfig {

    getName(): string;

    configureRoutes(): Application
}
