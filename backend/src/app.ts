import express from 'express';
import { AppInit } from './interfaces/AppInit.interface';
import { AppDataSource } from '@/config/dataSource';
import { IRoute } from './interfaces/IRoute.interface';
import { Application, RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import http from 'http'; 

const swaggerFile = YAML.load('./src/config/swagger/swagger-output.yaml');

class App {
    public app: Application;
    public port: number;
    public server: http.Server;

    constructor(appInit: AppInit) {
        this.app = express();
        this.port = appInit.port;
        this.server = http.createServer(this.app);

        this.initAssets();
        this.initMiddlewares(appInit.middlewares);
        this.initRoutes(appInit.controllers);
    }
    private initMiddlewares(middlewares: RequestHandler[]) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }
    private initRoutes(routes: IRoute[]) {
        routes.forEach(route => {
            this.app.use(route.path, route.router);
        });
    }
    private initAssets() {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(express.static('public'));
        this.app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    }
    public async listen() {
        if (process.env.NODE_ENV !== 'test') {
            await AppDataSource.initialize()
                .then(() => {
                    console.log('Data source has been initializated!');
                })
                .catch(err => {
                    console.log('Error during Data Source initialization: ', err);
                });

            this.server.listen(this.port, () => {
                console.log(`App listening  on the http://localhost:${this.port}`);
                process.on('exit', () => {
                    AppDataSource.destroy();
                });
            });
        }
    }
    public getApp() {
        return this.app;
    }
    public getServer() {
        return this.server;
    }
}

export default App;
