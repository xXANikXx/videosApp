// Enum для доступных разрешений
export enum VideoQuality {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160"
}

// Тип для видео
export type Video = {
    id: number;                      // уникальный идентификатор
    title: string;                   // название видео
    author: string;                  // автор
    canBeDownloaded: boolean;        // можно ли скачать
    minAgeRestriction: number | null; // минимальный возраст или null
    createdAt: string;               // дата создания
    publicationDate: string;         // дата публикации
    availableResolutions: VideoQuality[]; // массив доступных разрешений
};
