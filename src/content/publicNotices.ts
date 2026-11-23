import { useEffect, useState } from "react";

import { hccGet, hccResourceUrl } from "@api/hccClient";

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
    isPdf: boolean;
    agency?: string;
    sizeBytes?: number;
};

export type PublicNoticeCategory = {
    id: string;
    title: string;
    description: string;
    notices: PublicNotice[];
};

const warn: Warn = message => {
    // eslint-disable-next-line no-console
    console.warn(`[public-notices] ${message}`);
};

const looksLikePdf = (url: string) => {
    try {
        return new URL(url).pathname.toLowerCase().endsWith(".pdf");
    } catch {
        return url.toLowerCase().includes(".pdf");
    }
};

const parseCategories = (
    raw: unknown,
    warnInvalid: Warn,
): PublicNoticeCategory[] => {
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
            warnInvalid(
                `Bỏ qua danh mục #${categoryIndex + 1}: thiếu id hoặc title`,
            );
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
                warnInvalid(
                    `Bỏ qua văn bản #${
                        noticeIndex + 1
                    } trong "${id}": thiếu id hoặc title`,
                );
                return;
            }

            if (seenNoticeIds.has(noticeId)) {
                warnInvalid(`Trùng id văn bản "${noticeId}", bỏ qua bản sau`);
                return;
            }

            seenNoticeIds.add(noticeId);
            const url = resolveMediaUrl(readString(rawNotice.file));

            notices.push({
                id: noticeId,
                title: noticeTitle,
                url,
                isPdf: looksLikePdf(url),
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

const manifestNotices = createRemoteContent({
    label: "public-notices",
    path: "documents/public-notices.json",
    fallback: fallbackManifest,
    parse: parseCategories,
});

const bundledCategories = manifestNotices.parse(fallbackManifest);

export const parsePublicNotices = manifestNotices.parse;

type ApiFileType = {
    code: string;
    name: string;
    description: string | null;
};

type ApiFile = {
    id: number;
    name: string;
    type: { code: string; name: string };
    agency: string | null;
    mimeType: string;
    sizeBytes: number;
    downloadPath: string;
};

type ApiFilePage = {
    items: ApiFile[];
    pagination: { page: number; totalPages: number };
};

const FILE_PAGE_SIZE = 100;
const BACKEND_TIMEOUT_MS = 6000;

const getFilePage = (page: number) =>
    hccGet<ApiFilePage>("files", {
        params: { page, pageSize: FILE_PAGE_SIZE },
        timeoutMs: BACKEND_TIMEOUT_MS,
    });

const loadAllFiles = async (): Promise<ApiFile[]> => {
    const firstPage = await getFilePage(1);
    const restPages = await Promise.all(
        Array.from(
            { length: Math.max(0, firstPage.pagination.totalPages - 1) },
            (_, index) => getFilePage(index + 2),
        ),
    );

    return [firstPage, ...restPages].flatMap(page => page.items);
};

const loadFromBackend = async (): Promise<PublicNoticeCategory[]> => {
    const [types, files] = await Promise.all([
        hccGet<ApiFileType[]>("file-types", {
            timeoutMs: BACKEND_TIMEOUT_MS,
        }),
        loadAllFiles(),
    ]);

    const categories = types
        .map(type => ({
            id: type.code,
            title: type.name,
            description:
                type.description?.trim() ||
                `Các văn bản thuộc nhóm ${type.name} được niêm yết công khai.`,
            notices: files
                .filter(file => file.type.code === type.code)
                .map(file => ({
                    id: `file-${file.id}`,
                    title: file.name.trim(),
                    url: hccResourceUrl(file.downloadPath),
                    isPdf: file.mimeType === "application/pdf",
                    agency: file.agency?.trim() || undefined,
                    sizeBytes: file.sizeBytes,
                })),
        }))
        .filter(category => category.notices.length > 0);

    if (categories.length === 0) {
        throw new Error("Backend chưa có văn bản công khai nào");
    }

    return categories;
};

let cachedCategories: PublicNoticeCategory[] | undefined;
let pendingCategories: Promise<PublicNoticeCategory[]> | undefined;

export const loadPublicNotices = (): Promise<PublicNoticeCategory[]> => {
    if (!pendingCategories) {
        pendingCategories = loadFromBackend()
            .catch(error => {
                warn(
                    `Không tải được từ API backend, dùng manifest R2: ${error}`,
                );
                return manifestNotices.load();
            })
            .then(categories => {
                cachedCategories = categories;
                return categories;
            })
            .finally(() => {
                pendingCategories = undefined;
            });
    }

    return pendingCategories;
};

export const usePublicNotices = () => {
    const [categories, setCategories] = useState<
        PublicNoticeCategory[] | undefined
    >(cachedCategories);

    useEffect(() => {
        let active = true;

        loadPublicNotices()
            .then(result => {
                if (active) {
                    setCategories(result);
                }
            })
            .catch(error => {
                warn(`Không tải được văn bản, dùng dữ liệu đóng gói: ${error}`);

                if (active) {
                    setCategories(current => current ?? bundledCategories);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    return { categories: categories ?? [], loading: categories === undefined };
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

export const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes <= 0) {
        return "";
    }

    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
};
