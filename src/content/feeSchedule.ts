import fallbackSchedule from "./fee-schedule.json";
import {
    createRemoteContent,
    isRecord,
    readString,
    resolveMediaUrl,
    Warn,
} from "./remoteContent";

// Bảng niêm yết phí, lệ phí. Đọc từ documents/fee-schedule.json trên R2
// (sửa mức phí không cần deploy), dùng bản đóng gói khi không tải được.
// Cấu trúc giống frontend/constants/fees.ts của website.

export const FREE_OF_CHARGE = "Miễn phí";

export type FeeLine = {
    name: string;
    /** Nộp trực tiếp hoặc qua bưu chính */
    direct?: string;
    online?: string;
    /** Điều kiện in dưới mức thu trực tuyến */
    onlineDetail?: string;
    note?: string;
};

export type FeeItem = FeeLine & {
    no: string;
    /** Các trường hợp con (dòng "-" trong bảng niêm yết) */
    children: FeeLine[];
};

export type FeeSection = {
    code?: string;
    title?: string;
    items: FeeItem[];
};

export type FeeGroup = {
    code: string;
    title: string;
    note?: string;
    sections: FeeSection[];
};

export type FeeSchedule = {
    title: string;
    pdfUrl: string;
    groups: FeeGroup[];
};

const optional = (value: unknown) => readString(value) || undefined;

const parseLine = (raw: unknown): FeeLine | undefined => {
    const name = isRecord(raw) ? readString(raw.name) : "";

    if (!isRecord(raw) || !name) {
        return undefined;
    }

    return {
        name,
        direct: optional(raw.direct),
        online: optional(raw.online),
        onlineDetail: optional(raw.onlineDetail),
        note: optional(raw.note),
    };
};

const parseItems = (raw: unknown, where: string, warn: Warn): FeeItem[] =>
    (Array.isArray(raw) ? raw : []).flatMap((rawItem, index) => {
        const line = parseLine(rawItem);

        if (!line || !isRecord(rawItem)) {
            warn(`Bỏ qua dòng #${index + 1} trong ${where}: thiếu name`);
            return [];
        }

        return [
            {
                ...line,
                no: readString(rawItem.no) || String(index + 1),
                children: (Array.isArray(rawItem.children)
                    ? rawItem.children
                    : []
                ).flatMap(child => {
                    const childLine = parseLine(child);
                    return childLine ? [childLine] : [];
                }),
            },
        ];
    });

/** Trả về mảng một phần tử để dùng chung createRemoteContent. */
const parseSchedule = (raw: unknown, warn: Warn): FeeSchedule[] => {
    if (!isRecord(raw) || !Array.isArray(raw.groups)) {
        warn("Thiếu mảng groups");
        return [];
    }

    const groups = raw.groups.flatMap((rawGroup, groupIndex) => {
        const code = isRecord(rawGroup) ? readString(rawGroup.code) : "";
        const title = isRecord(rawGroup) ? readString(rawGroup.title) : "";

        if (!isRecord(rawGroup) || !title) {
            warn(`Bỏ qua nhóm #${groupIndex + 1}: thiếu title`);
            return [];
        }

        const sections = (
            Array.isArray(rawGroup.sections) ? rawGroup.sections : []
        ).flatMap(rawSection => {
            if (!isRecord(rawSection)) {
                return [];
            }

            const items = parseItems(rawSection.items, `nhóm "${title}"`, warn);

            return items.length
                ? [
                      {
                          code: optional(rawSection.code),
                          title: optional(rawSection.title),
                          items,
                      },
                  ]
                : [];
        });

        return sections.length
            ? [
                  {
                      code: code || String(groupIndex + 1),
                      title,
                      note: optional(rawGroup.note),
                      sections,
                  },
              ]
            : [];
    });

    if (groups.length === 0) {
        return [];
    }

    return [
        {
            title:
                readString(raw.title) ||
                "Bảng niêm yết công khai phí, lệ phí giải quyết TTHC",
            pdfUrl: resolveMediaUrl(readString(raw.pdf)),
            groups,
        },
    ];
};

const feeSchedule = createRemoteContent({
    label: "fee-schedule",
    path: "documents/fee-schedule.json",
    fallback: fallbackSchedule,
    parse: parseSchedule,
});

export const loadFeeSchedule = feeSchedule.load;

export const useFeeSchedule = () => {
    const { items, loading } = feeSchedule.useContent();

    return { schedule: items[0] as FeeSchedule | undefined, loading };
};

/** "8.000" → "8.000 đ", "1,500,000" → "1.500.000 đ"; giữ nguyên chữ ("Miễn phí", "2.000/trang…"). */
export const formatFeeAmount = (value?: string): string | undefined => {
    if (!value) {
        return undefined;
    }

    const trimmed = value.trim();

    if (/^\d[\d.,]*\s*(đ|đồng)?$/i.test(trimmed)) {
        // Tự chèn dấu chấm, không dùng toLocaleString vì webview cũ có thể thiếu dữ liệu locale
        const digits = trimmed.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

        return `${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ`;
    }

    return trimmed;
};
