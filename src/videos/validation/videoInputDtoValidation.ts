import { ValidationError } from "../types/validationError";
import { CreateVideoInputDto } from "../DTO/video.input-dto";
import { UpdateVideoInputDto } from "../DTO/video.update-dto"; // новый DTO для update
import { VideoQuality } from "../types/videoType";

// проверка базовых полей (для create)
function validateBaseFields(data: CreateVideoInputDto): ValidationError[] {
    const errors: ValidationError[] = [];

    // title
    if (
        !data.title ||
        typeof data.title !== "string" ||
        data.title.trim().length < 2 ||
        data.title.trim().length > 40
    ) {
        errors.push({ field: "title", message: "Invalid title" });
    }

    // author
    if (
        !data.author ||
        typeof data.author !== "string" ||
        data.author.trim().length < 2 ||
        data.author.trim().length > 20
    ) {
        errors.push({ field: "author", message: "Invalid author" });
    }

    // availableResolutions
    if (!Array.isArray(data.availableResolutions) || data.availableResolutions.length < 1) {
        errors.push({
            field: "availableResolutions",
            message: "At least one resolution should be added",
        });
    } else {
        const allowedResolutions = Object.values(VideoQuality);
        for (const res of data.availableResolutions) {
            if (!allowedResolutions.includes(res)) {
                errors.push({
                    field: "availableResolutions",
                    message: `Invalid resolution: ${res}`,
                });
                break;
            }
        }
    }

    return errors;
}

// валидация для POST (create)
export function validateCreateVideoInput(data: CreateVideoInputDto): ValidationError[] {
    return validateBaseFields(data);
}

// валидация для PUT (update)
export function validateUpdateVideoInput(data: UpdateVideoInputDto): ValidationError[] {
    const errors: ValidationError[] = [];

    // title
    if (data.title !== undefined) {
        if (
            typeof data.title !== "string" ||
            data.title.trim().length < 2 ||
            data.title.trim().length > 40
        ) {
            errors.push({ field: "title", message: "Invalid title" });
        }
    }

    // author
    if (data.author !== undefined) {
        if (
            typeof data.author !== "string" ||
            data.author.trim().length < 2 ||
            data.author.trim().length > 20
        ) {
            errors.push({ field: "author", message: "Invalid author" });
        }
    }

    // availableResolutions
    if (data.availableResolutions !== undefined) {
        if (!Array.isArray(data.availableResolutions) || data.availableResolutions.length < 1) {
            errors.push({
                field: "availableResolutions",
                message: "At least one resolution should be added",
            });
        } else {
            const allowedResolutions = Object.values(VideoQuality);
            for (const res of data.availableResolutions) {
                if (!allowedResolutions.includes(res)) {
                    errors.push({
                        field: "availableResolutions",
                        message: `Invalid resolution: ${res}`,
                    });
                    break;
                }
            }
        }
    }

    // canBeDownloaded
    if (data.canBeDownloaded !== undefined && typeof data.canBeDownloaded !== "boolean") {
        errors.push({ field: "canBeDownloaded", message: "Must be boolean" });
    }

    // minAgeRestriction
    if (data.minAgeRestriction !== undefined) {
        if (
            data.minAgeRestriction !== null &&
            (typeof data.minAgeRestriction !== "number" ||
                data.minAgeRestriction < 1 ||
                data.minAgeRestriction > 18)
        ) {
            errors.push({
                field: "minAgeRestriction",
                message: "Age must be 1–18 or null",
            });
        }
    }

    // publicationDate
    if (data.publicationDate !== undefined) {
        if (typeof data.publicationDate !== "string") {
            errors.push({
                field: "publicationDate",
                message: "Publication date must be a string",
            });
        } else {
            const date = new Date(data.publicationDate);
            if (isNaN(date.getTime()) || date.toISOString() !== data.publicationDate) {
                errors.push({
                    field: "publicationDate",
                    message: "Publication date must be valid ISO 8601 date-time string",
                });
            }
        }
    }

    return errors;
}
