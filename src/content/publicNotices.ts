import fallbackManifest from "./public-notices.json";
import {
    createRemoteContent,
    isRecord,
    readString,
    resolveMediaUrl,
    Warn,
} from "./remoteContent";

export type PublicNotice = {
    id: string;
    title: string;
    url: string;
};

export type PublicNoticeCategory = {
    id: string;
    title: string;
    description: string;
    notices: PublicNotice[];
};

const parseCategories = (raw: unknown, warn: Warn): PublicNoticeCategory[] => {
    const rawCategories: unknown[] =
        isRecord(raw) && Array.isArray(raw.categories) ? raw.categories : [];
    const seenNoticeIds = new Set<string>();
    const categories: PublicNoticeCategory[] = [];

    rawCategories.forEach((rawCategory, categoryIndex) => {
        const id = isRecord(rawCategory) ? readString(rawCategory.id) : "";
        const title = isRecord(rawCategory)
            ? readString(rawCategory.title)
            : "";

        if (!isRecord(rawCategory) || !id || !title) {
            warn(`Bỏ qua danh mục #${categoryIndex + 1}: thiếu id hoặc title`);
            return;
        }

        const rawNotices: unknown[] = Array.isArray(rawCategory.notices)
            ? rawCategory.notices
            : [];
        const notices: PublicNotice[] = [];

        rawNotices.forEach((rawNotice, noticeIndex) => {
            const noticeId = isRecord(rawNotice)
                ? readString(rawNotice.id)
                : "";
            const noticeTitle = isRecord(rawNotice)
                ? readString(rawNotice.title)
                : "";

            if (!isRecord(rawNotice) || !noticeId || !noticeTitle) {
                warn(
                    `Bỏ qua văn bản #${
                        noticeIndex + 1
                    } trong "${id}": thiếu id hoặc title`,
                );
                return;
            }

            if (seenNoticeIds.has(noticeId)) {
                warn(`Trùng id văn bản "${noticeId}", bỏ qua bản sau`);
                return;
            }

            seenNoticeIds.add(noticeId);
            notices.push({
                id: noticeId,
                title: noticeTitle,
                url: resolveMediaUrl(readString(rawNotice.file)),
            });
        });

        categories.push({
            id,
            title,
            description: readString(rawCategory.description),
            notices,
        });
    });

    return categories;
};

const publicNotices = createRemoteContent({
    label: "public-notices",
    path: "documents/public-notices.json",
    fallback: fallbackManifest,
    parse: parseCategories,
});

export const parsePublicNotices = publicNotices.parse;
export const loadPublicNotices = publicNotices.load;

export const usePublicNotices = () => {
    const { items, loading } = publicNotices.useContent();

    return { categories: items, loading };
};

export const findPublicNotice = (
    categories: PublicNoticeCategory[],
    noticeId: string,
): { notice: PublicNotice; category: PublicNoticeCategory } | undefined => {
    let match:
        | { notice: PublicNotice; category: PublicNoticeCategory }
        | undefined;

    categories.some(category => {
        const notice = category.notices.find(item => item.id === noticeId);

        if (notice) {
            match = { notice, category };
        }

        return Boolean(notice);
    });

    return match;
};
