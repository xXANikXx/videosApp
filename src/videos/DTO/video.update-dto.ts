import { VideoQuality } from "../types/videoType";

export type UpdateVideoInputDto = {
    title?: string;
    author?: string;
    availableResolutions?: VideoQuality[];
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    publicationDate?: string;
};
