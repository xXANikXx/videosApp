import request from "supertest";
import express from "express";

import { HttpStatus } from "../src/core/types/HTTP-statuses";
import { setupApp } from "../src/setupApp";
import { CreateVideoInputDto } from "../src/videos/DTO/video.input-dto";
import { UpdateVideoInputDto } from "../src/videos/DTO/video.update-dto";
import { VideoQuality } from "../src/videos/types/videoType";

describe("Video API (CRUD)", () => {
    const app = express();
    setupApp(app);

    const testVideoData: CreateVideoInputDto = {
        title: "NewTestVideo",
        author: "Nikk",
        availableResolutions: [VideoQuality.P720],
    };

    beforeAll(async () => {
        await request(app)
            .delete("/hometask_01/testing/all-data")
            .expect(HttpStatus.NoContent);
    });

    it("should create video; POST /hometask_01/videos", async () => {
        const newVideo: CreateVideoInputDto = {
            ...testVideoData,
            title: "NewTestVideo2",
            author: "NikNi",
            availableResolutions: [VideoQuality.P240],
        };

        await request(app)
            .post("/hometask_01/videos")
            .send(newVideo)
            .expect(HttpStatus.Created);
    });

    it("should return video list; GET /hometask_01/videos", async () => {
        await request(app)
            .post("/hometask_01/videos")
            .send({ ...testVideoData, title: "NewTestVideo5" })
            .expect(HttpStatus.Created);

        await request(app)
            .post("/hometask_01/videos")
            .send({ ...testVideoData, title: "NewTestVideo3" })
            .expect(HttpStatus.Created);

        const videoListResponse = await request(app)
            .get("/hometask_01/videos")
            .expect(HttpStatus.Ok);

        expect(videoListResponse.body).toBeInstanceOf(Array);
        expect(videoListResponse.body.length).toBeGreaterThanOrEqual(2);
    });

    it("should return video by id; GET /hometask_01/videos/:id", async () => {
        const createResponse = await request(app)
            .post("/hometask_01/videos")
            .send({ ...testVideoData, title: "Another Video" })
            .expect(HttpStatus.Created);

        const getResponse = await request(app)
            .get(`/hometask_01/videos/${createResponse.body.id}`)
            .expect(HttpStatus.Ok);

        expect(getResponse.body).toEqual({
            ...createResponse.body,
            id: expect.any(Number),
            createdAt: expect.any(String),
        });
    });

    it("should update video; PUT /hometask_01/videos/:id", async () => {
        const createResponse = await request(app)
            .post("/hometask_01/videos")
            .send({ ...testVideoData, title: "VideoToUpdate" })
            .expect(HttpStatus.Created);

        const videoUpdateData: UpdateVideoInputDto = {
            title: "Updated Title",
            author: "Updated Author",
            availableResolutions: [VideoQuality.P360],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: "2025-09-13T12:06:30.342Z",
        };

        await request(app)
            .put(`/hometask_01/videos/${createResponse.body.id}`)
            .send(videoUpdateData)
            .expect(HttpStatus.NoContent);

        const videoResponse = await request(app).get(
            `/hometask_01/videos/${createResponse.body.id}`
        );

        expect(videoResponse.body).toEqual({
            ...videoUpdateData,
            id: createResponse.body.id,
            createdAt: expect.any(String),
        });
    });

    it("should delete video and return NOT FOUND afterwards; DELETE /hometask_01/videos/:id", async () => {
        const {
            body: { id: createdVideoId },
        } = await request(app)
            .post("/hometask_01/videos")
            .send({ ...testVideoData, title: "VideoToDelete" })
            .expect(HttpStatus.Created);

        await request(app)
            .delete(`/hometask_01/videos/${createdVideoId}`)
            .expect(HttpStatus.NoContent);

        const videoResponse = await request(app).get(
            `/hometask_01/videos/${createdVideoId}`
        );
        expect(videoResponse.status).toBe(HttpStatus.NotFound);
    });
});
