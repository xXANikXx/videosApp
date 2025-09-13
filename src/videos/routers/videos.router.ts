import { Router, Request, Response } from 'express';
import { db } from '../../db/in_memory.db';
import { HttpStatus } from '../../core/types/HTTP-statuses';
import { Video } from '../../videos/types/videoType';
import {
    validateCreateVideoInput,
    validateUpdateVideoInput,
} from '../../videos/validation/videoInputDtoValidation';
import { createErrorMessages } from '../../core/utils/error.utils';
import { CreateVideoInputDto } from '../DTO/video.input-dto';
import { UpdateVideoInputDto } from '../DTO/video.update-dto'; // новый DTO для update

export const videoRouter = Router({});

// ===== GET all videos =====
videoRouter.get('', (_req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send(db.video);
});

// ===== GET video by id =====
videoRouter.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const video = db.video.find((v) => v.id === id);

    if (!video) {
        res.status(HttpStatus.NotFound).send(
            createErrorMessages([{ field: 'id', message: 'Video not found' }]),
        );
        return;
    }

    res.status(HttpStatus.Ok).send(video);
});

// ===== CREATE video =====
videoRouter.post('', (req: Request<{}, {}, CreateVideoInputDto>, res: Response) => {
    const errors = validateCreateVideoInput(req.body);

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
    }

    const createdAt = new Date();
    const publicationDate = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    const newVideo: Video = {
        id: db.video.length ? db.video[db.video.length - 1].id + 1 : 1,
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions ?? [],
        canBeDownloaded: req.body.canBeDownloaded ?? false,
        minAgeRestriction: req.body.minAgeRestriction ?? null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
    };

    db.video.push(newVideo);
    res.status(HttpStatus.Created).send(newVideo);
});

// ===== UPDATE video =====
videoRouter.put('/:id', (req: Request<{ id: string }, {}, UpdateVideoInputDto>, res: Response) => {
    const id = parseInt(req.params.id);
    const index = db.video.findIndex((v) => v.id === id);

    if (index === -1) {
        res.status(HttpStatus.NotFound).send(
            createErrorMessages([{ field: 'id', message: 'VideoId not found' }]),
        );
        return;
    }

    const errors = validateUpdateVideoInput(req.body);

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
        return;
    }

    const video = db.video[index];

    // Обновляем только переданные поля
    if (req.body.title !== undefined) video.title = req.body.title;
    if (req.body.author !== undefined) video.author = req.body.author;
    if (req.body.availableResolutions !== undefined)
        video.availableResolutions = req.body.availableResolutions;
    if (req.body.canBeDownloaded !== undefined)
        video.canBeDownloaded = req.body.canBeDownloaded;
    if (req.body.minAgeRestriction !== undefined)
        video.minAgeRestriction = req.body.minAgeRestriction;
    if (req.body.publicationDate !== undefined)
        video.publicationDate = req.body.publicationDate;

    res.sendStatus(HttpStatus.NoContent);
});

// ===== DELETE video =====
videoRouter.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = db.video.findIndex((v) => v.id === id);

    if (index === -1) {
        res.status(HttpStatus.NotFound).send(
            createErrorMessages([{ field: 'id', message: 'Video not found' }]),
        );
        return;
    }

    db.video.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
});
