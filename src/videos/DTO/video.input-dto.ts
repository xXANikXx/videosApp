import { VideoQuality } from "../types/videoType";


export type CreateVideoInputDto = {
    title: string;
    author: string;
    availableResolutions: VideoQuality[];
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    publicationDate?: string;
}