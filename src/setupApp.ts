import express, { Express, Request, Response } from 'express';
import { videoRouter } from './videos/routers/videos.router';
import { testingRouter } from './videos/testing/routers/testing.router';
import { setupSwagger } from './core/swagger/setup-swagger';

export const setupApp = (app: Express) => {
    app.use(express.json());// middleware для парсинга JSON в теле запроса

    app.get('/', (_req: Request, res: Response) => {
        res.status(200).send('hello world!!!');
    });

    app.use('/hometask_01/api/videos', videoRouter);
    app.use('/hometask_01/api/testing', testingRouter);

    setupSwagger(app);
    return app;
};
