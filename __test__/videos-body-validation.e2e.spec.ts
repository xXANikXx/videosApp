import request from "supertest";
import express from "express";

import { HttpStatus } from "../src/core/types/HTTP-statuses";
import { setupApp } from "../src/setupApp";
import { CreateVideoInputDto } from "../src/videos/DTO/video.input-dto";
import { UpdateVideoInputDto } from "../src/videos/DTO/video.update-dto";
import { VideoQuality } from "../src/videos/types/videoType";

describe("Video API (Validation)", () => {
    const app = express();
    setupApp(app);

    const correctCreateVideoData: CreateVideoInputDto = {
        title: "NewTestVideo",
        author: "Nik",
        availableResolutions: [VideoQuality.P720],
    };

    beforeAll(async () => {
        await request(app)
            .delete("/hometask_01/testing/all-data")
            .expect(HttpStatus.NoContent);
    });

    it("should not create VIDEO when incorrect body passed; POST /hometask_01/videos", async () => {
        const invalidDataSet1 = await request(app)
            .post("/hometask_01/videos")
            .send({
                ...correctCreateVideoData,
                title: "   ",
                author: "    ",
                availableResolutions: [],
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorMessages).toHaveLength(3);

        const invalidDataSet2 = await request(app)
            .post("/hometask_01/videos")
            .send({
                ...correctCreateVideoData,
                title: " erwrwerwerwerwerwerwrwerwwefdsfsdfsdfewfsdfdfsfadsfdsferwerwerwerwer  ",
                author: "",
                availableResolutions: [],
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorMessages).toHaveLength(3);

        const invalidDataSet3 = await request(app)
            .post("/hometask_01/videos")
            .send({
                ...correctCreateVideoData,
                title: "A", // too short
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

        const videoListResponse = await request(app).get("/hometask_01/videos");
        expect(videoListResponse.body).toHaveLength(0);
    });

    it("should not update video when incorrect data passed; PUT /hometask_01/videos/:id", async () => {
        const {
            body: { id: createdVideoId },
        } = await request(app)
            .post("/hometask_01/videos")
            .send(correctCreateVideoData)
            .expect(HttpStatus.Created);

        // 1) Некорректные данные для всех полей
        const invalidDataSet1 = await request(app)
            .put(`/hometask_01/videos/${createdVideoId}`)
            .send({
                title: "   ", // слишком короткий/пустой
                author: "    ", // пустой
                availableResolutions: ["P3456"], // недопустимое разрешение
                canBeDownloaded: "boolean", // должно быть boolean
                minAgeRestriction: "", // должно быть число или null
                publicationDate: "", // пустая строка
            } as unknown as UpdateVideoInputDto)
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorMessages).toHaveLength(6);

        // 2) Частично некорректное поле (слишком короткий title)
        const invalidDataSet2 = await request(app)
            .put(`/hometask_01/videos/${createdVideoId}`)
            .send({
                title: "A", // слишком короткий
                author: "Nik",
                availableResolutions: [VideoQuality.P720],
                canBeDownloaded: false,
                minAgeRestriction: 1,
                publicationDate: "2025-09-13T12:06:30.342Z",
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorMessages).toHaveLength(1);

        // Проверяем, что данные в базе не изменились
        const videoResponse = await request(app).get(
            `/hometask_01/videos/${createdVideoId}`
        );

        expect(videoResponse.body).toEqual({
            ...correctCreateVideoData,
            id: createdVideoId,
            title: expect.any(String),
            author: expect.any(String),
            createdAt: expect.any(String),
            availableResolutions: expect.any(Array),
            minAgeRestriction: null, // остаётся null, т.к. не было обновления
            canBeDownloaded: false,
            publicationDate: expect.any(String),
        });
    });

    it("should not update video when incorrect features passed; PUT /hometask_01/videos/:id", async () => {
        const {
            body: { id: createdVideoId },
        } = await request(app)
            .post("/hometask_01/videos")
            .send(correctCreateVideoData)
            .expect(HttpStatus.Created);

        // Некорректный формат availableResolutions
        await request(app)
            .put(`/hometask_01/videos/${createdVideoId}`)
            .send({
                title: "Invalid Format",
                author: "Nik",
                availableResolutions: [[VideoQuality]], // массив массивов – некорректно
                canBeDownloaded: false,
                minAgeRestriction: 18,
                publicationDate: "2025-09-13T12:06:30.342Z",
            } as unknown as UpdateVideoInputDto)
            .expect(HttpStatus.BadRequest);

        // Проверяем, что данные не изменились
        const videoResponse = await request(app).get(
            `/hometask_01/videos/${createdVideoId}`
        );

        expect(videoResponse.body).toEqual({
            ...correctCreateVideoData,
            id: createdVideoId,
            title: expect.any(String),
            author: expect.any(String),
            createdAt: expect.any(String),
            availableResolutions: expect.any(Array),
            minAgeRestriction: null, // остаётся null
            canBeDownloaded: false,
            publicationDate: expect.any(String),
        });
    });
})