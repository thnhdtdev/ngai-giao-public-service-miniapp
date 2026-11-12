// Port từ web-tthc/frontend/lib/procedure-detail.ts để mini app hiển thị
// chi tiết thủ tục giống website. Khi sửa một bên, nên sửa cả bên kia.
import type { ProcedureDetail } from "./procedures";

const SUBMISSION_METHODS: Record<string, string> = {
    DIRECT: "Trực tiếp",
    ONLINE: "Trực tuyến",
    POSTAL: "Qua bưu chính",
};

const TIME_UNITS: Record<string, string> = {
    WORKING_DAY: "ngày làm việc",
    DAY: "ngày",
    HOUR: "giờ",
    MONTH: "tháng",
};

const moneyFormat = new Intl.NumberFormat("vi-VN");

export type DossierItem = {
    name: string;
    required: boolean;
    originalQty: number | null;
    copyQty: number | null;
    forms: string[];
};

export type DossierGroup = { name: string; items: DossierItem[] };

export type ProcedureDetailView = {
    durations: string[];
    fees: string[];
    // Mô tả lệ phí thường dài và giống nhau giữa các kênh nên chỉ hiện một lần
    feeNotes: string[];
    channels: string[];
    results: string[];
    requirements: string | null;
    note: string | null;
    methods: {
        channel: string;
        duration: string | null;
        fees: string[];
        description: string;
    }[];
    steps: { name: string; description: string }[];
    dossier: DossierGroup[];
    legalBases: { code: string; name: string }[];
};

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const records = (value: unknown): JsonRecord[] =>
    Array.isArray(value) ? value.filter(isRecord) : [];

const text = (value: unknown): string =>
    typeof value === "string" || typeof value === "number"
        ? String(value).trim()
        : "";

const count = (value: unknown): number | null =>
    typeof value === "number" && Number.isFinite(value) ? value : null;

// Dữ liệu cổng DVC hay mở đầu bằng "-\t", "- " hoặc "+ "; UI tự vẽ bullet
export const stripBullet = (value: string): string =>
    value.replace(/^[-–•+]\s*/, "").trim();

const unique = (values: (string | null)[]): string[] =>
    Array.from(
        new Set(values.filter((value): value is string => Boolean(value))),
    );

const formatDuration = (time: string, unit: string): string | null => {
    const label = TIME_UNITS[unit];

    return label && Number(time) > 0 ? `${time} ${label}` : null;
};

type Fee = { value: string; currency: string; description: string };

// Số tiền 0 kèm mô tả nghĩa là "quy định ở văn bản khác" (ví dụ HĐND tỉnh),
// nên chỉ hiện "Không thu phí" khi hoàn toàn không có mô tả.
const formatFeeAmount = (fee: Fee): string | null => {
    const amount = Number(fee.value);

    if (fee.value === "" || !Number.isFinite(amount)) {
        return fee.value || null;
    }

    if (amount === 0) {
        return fee.description ? null : "Không thu phí";
    }

    return `${moneyFormat.format(amount)} ${
        fee.currency === "USD" ? "USD" : "đồng"
    }`;
};

// Số bản chính/bản sao và tên biểu mẫu chỉ có trong dữ liệu gốc của cổng
const dossierFromPortalData = (portalData: unknown): DossierGroup[] => {
    if (!isRecord(portalData)) {
        return [];
    }

    return records(portalData.executionCases)
        .map(group => ({
            name: stripBullet(text(group.name)),
            items: records(group.profileComponents)
                .map(component => ({
                    name: stripBullet(text(component.name)),
                    required: component.required === true,
                    originalQty: count(component.originalQty),
                    copyQty: count(component.copyQty),
                    forms: records(component.attachments)
                        .map(attachment => text(attachment.fileName))
                        .filter(Boolean),
                }))
                .filter(item => item.name),
        }))
        .filter(group => group.items.length > 0);
};

const dossierFromStructured = (
    details: ProcedureDetail["structuredDetails"],
): DossierGroup[] => {
    const groups = details.executionCases.length
        ? details.executionCases
        : details.cases;

    return groups
        .map(group => ({
            name: stripBullet(group.name),
            items: group.profileComponents.map(component => ({
                name: stripBullet(component.name),
                required: component.required === true,
                originalQty: null,
                copyQty: null,
                forms: [],
            })),
        }))
        .filter(group => group.items.length > 0);
};

export const buildProcedureDetailView = (
    response: ProcedureDetail,
): ProcedureDetailView => {
    const details = response.structuredDetails;
    const portalDossier = dossierFromPortalData(response.portalData);
    const dossier = portalDossier.length
        ? portalDossier
        : dossierFromStructured(details);

    const methods = details.executionMethods.map(method => ({
        channel:
            SUBMISSION_METHODS[method.submissionMethod] ??
            method.submissionMethod,
        duration: formatDuration(
            method.processingTime,
            method.processingTimeUnit,
        ),
        fees: unique(method.fees.map(formatFeeAmount)),
        description: method.description,
    }));

    return {
        // Kênh nộp thường bỏ trống thời hạn; lấy thêm từ từng trường hợp
        durations: unique([
            ...methods.map(method => method.duration),
            ...details.cases.map(entry =>
                formatDuration(entry.processingTime, entry.processingTimeUnit),
            ),
        ]),
        fees: unique(
            methods.reduce<string[]>(
                (all, method) => all.concat(method.fees),
                [],
            ),
        ),
        feeNotes: unique(
            details.executionMethods.reduce<string[]>(
                (all, method) =>
                    all.concat(
                        method.fees.map(fee => stripBullet(fee.description)),
                    ),
                [],
            ),
        ),
        channels: unique(methods.map(method => method.channel)),
        results: unique(details.results.map(result => result.name)),
        requirements: details.requirementsAndConditions,
        note: details.note,
        methods,
        steps: details.executionSteps,
        dossier,
        legalBases: details.legalBases,
    };
};
