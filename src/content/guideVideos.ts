import fallbackManifest from "./guide-videos.json";
import {
    createRemoteContent,
    isRecord,
    readString,
    resolveMediaUrl,
    Warn,
} from "./remoteContent";

export type GuideVideo = {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    /** Hiển thị thẻ "Nhóm Zalo hỗ trợ kinh doanh" ngay dưới video này */
    showBusinessGroup: boolean;
};

const parseVideos = (raw: unknown, warn: Warn): GuideVideo[] => {
    const rawVideos: unknown[] =
        isRecord(raw) && Array.isArray(raw.videos) ? raw.videos : [];
    const seenIds = new Set<string>();
    const videos: GuideVideo[] = [];

    rawVideos.forEach((rawVideo, index) => {
        const id = isRecord(rawVideo) ? readString(rawVideo.id) : "";
        const title = isRecord(rawVideo) ? readString(rawVideo.title) : "";
        const file = isRecord(rawVideo) ? readString(rawVideo.file) : "";

        if (!isRecord(rawVideo) || !id || !title || !file) {
            warn(`Bỏ qua video #${index + 1}: thiếu id, title hoặc file`);
            return;
        }

        if (seenIds.has(id)) {
            warn(`Trùng id video "${id}", bỏ qua bản sau`);
            return;
        }

        seenIds.add(id);
        videos.push({
            id,
            title,
            description: readString(rawVideo.description),
            videoUrl: resolveMediaUrl(file),
            showBusinessGroup: rawVideo.showBusinessGroup === true,
        });
    });

    return videos;
};

const guideVideos = createRemoteContent({
    label: "guide-videos",
    path: "videos/guide-videos.json",
    fallback: fallbackManifest,
    parse: parseVideos,
});

export const parseGuideVideos = guideVideos.parse;

export const useGuideVideos = () => {
    const { items, loading } = guideVideos.useContent();

    return { videos: items, loading };
};
