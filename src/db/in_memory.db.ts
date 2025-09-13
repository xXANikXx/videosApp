import { Video, VideoQuality } from '../videos/types/videoType';

export const db = { video: <Video[]> [
        {
            id: 0,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2025-09-12T06:04:48.444Z",
            publicationDate: "2025-09-12T06:04:48.444Z",
            availableResolutions: [VideoQuality.P144]
        }
    ]
};
