import { Router, Request, Response } from 'express';
import { db } from '../../../db/in_memory.db';
import { HttpStatus } from '../../../core/types/HTTP-statuses';

export const testingRouter = Router({});

testingRouter.delete('/all-data', (_req: Request, res: Response) => {
    db.video = [];
    res.sendStatus(HttpStatus.NoContent);
});
