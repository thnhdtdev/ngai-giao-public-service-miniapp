import { useEffect, useState } from "react";

const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL ?? "").replace(
    /\/+$/,
    "",
);
const REQUEST_TIMEOUT_MS = 8000;

export type UnknownRecord = Record<string, unknown>;
export type Warn = (message: string) => void;

export const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null && !Array.isArray(value);

export const readString = (value: unknown): string =>
    typeof value === "string" ? value.trim() : "";

/** Đường dẫn tương đối trong bucket → URL đầy đủ; giữ nguyên URL tuyệt đối. */
export const resolveMediaUrl = (path: string): string => {
    if (!path) {
        return "";
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return `${MEDIA_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

type RemoteContentOptions<T> = {
    /** Tiền tố log, ví dụ "guide-videos" */
    label: string;
    /** Đường dẫn file JSON trong bucket, ví dụ "videos/guide-videos.json" */
    path: string;
    /** Bản đóng gói trong app, dùng khi không tải được từ R2 */
    fallback: unknown;
    /** Chuyển JSON thành dữ liệu cho UI; bỏ qua mục sai cấu trúc */
    parse: (raw: unknown, warn: Warn) => T[];
};

/**
 * Nội dung lấy từ một file JSON trên R2: tải lại mỗi khi trang mở,
 * hiển thị ngay dữ liệu đã có trong phiên, và dùng bản đóng gói khi lỗi.
 */
export const createRemoteContent = <T>({
    label,
    path,
    fallback,
    parse,
}: RemoteContentOptions<T>) => {
    const warn: Warn = message => {
        // eslint-disable-next-line no-console
        console.warn(`[${label}] ${message}`);
    };

    const url = resolveMediaUrl(path);
    const fallbackItems = parse(fallback, warn);

    let cachedItems: T[] | undefined;
    let pendingRequest: Promise<T[]> | undefined;

    const fetchItems = async (): Promise<T[]> => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            // no-cache: luôn hỏi lại R2 nhưng vẫn dùng ETag (304) nên rất nhẹ
            const response = await fetch(url, {
                cache: "no-cache",
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const items = parse(await response.json(), warn);

            if (items.length === 0) {
                throw new Error("Danh sách rỗng hoặc sai cấu trúc");
            }

            return items;
        } finally {
            clearTimeout(timer);
        }
    };

    /** Tải từ R2; gộp các lời gọi đồng thời thành một request. */
    const load = (): Promise<T[]> => {
        if (!pendingRequest) {
            pendingRequest = fetchItems()
                .then(items => {
                    cachedItems = items;
                    return items;
                })
                .finally(() => {
                    pendingRequest = undefined;
                });
        }

        return pendingRequest;
    };

    const useContent = () => {
        const [items, setItems] = useState<T[] | undefined>(cachedItems);

        useEffect(() => {
            let active = true;

            load()
                .then(result => {
                    if (active) {
                        setItems(result);
                    }
                })
                .catch(error => {
                    warn(
                        `Không tải được từ R2, dùng dữ liệu đóng gói: ${error}`,
                    );

                    if (active) {
                        setItems(current => current ?? fallbackItems);
                    }
                });

            return () => {
                active = false;
            };
        }, []);

        return {
            items: items ?? [],
            loading: items === undefined,
        };
    };

    return {
        load,
        useContent,
        parse: (raw: unknown) => parse(raw, warn),
    };
};
