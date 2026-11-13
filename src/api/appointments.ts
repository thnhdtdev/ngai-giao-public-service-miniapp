import { useCallback, useEffect, useState } from "react";

import { normalizeSearchText } from "@utils/search";

import { HccApiError, hccGet, hccPost } from "./hccClient";

// API đặt lịch của backend hccngaigiao.vn. Backend chỉ nhận đặt lịch
// trong NGÀY HÔM NAY (khung giờ được tạo lúc 00:01 mỗi ngày).

export type BookingCategory = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    requiredDocuments: string[];
};

export type BookingSlot = {
    id: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    bookedCount: number;
};

export type AppointmentStatus =
    | "PENDING"
    | "COMPLETED"
    | "MISSED"
    | "CANCELLED";

export type AppointmentSlotInfo = {
    bookingDate: string;
    startTime: string;
    endTime: string;
    category: { code: string; name: string };
};

export type CreatedAppointment = {
    id: string;
    bookingCode: string;
    citizenName: string;
    phone: string;
    status: AppointmentStatus;
    createdAt: string;
    slot: AppointmentSlotInfo;
};

export type LookedUpAppointment = Omit<CreatedAppointment, "phone">;

export type CreateAppointmentInput = {
    slotId: number;
    citizenName: string;
    phone: string;
    citizenId?: string;
};

type BookingAction = "categories" | "slots" | "create" | "lookup" | "cancel";

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
    PENDING: "Chờ tiếp nhận",
    COMPLETED: "Đã tiếp nhận",
    MISSED: "Vắng mặt",
    CANCELLED: "Đã huỷ",
};

// ---------------------------------------------------------------------------
// Lĩnh vực
// ---------------------------------------------------------------------------

let cachedCategories: BookingCategory[] | undefined;
let pendingCategories: Promise<BookingCategory[]> | undefined;

export const loadBookingCategories = (): Promise<BookingCategory[]> => {
    if (cachedCategories) {
        return Promise.resolve(cachedCategories);
    }

    if (!pendingCategories) {
        pendingCategories = hccGet<BookingCategory[]>("categories")
            .then(categories => {
                cachedCategories = categories.map(category => ({
                    ...category,
                    requiredDocuments: Array.isArray(category.requiredDocuments)
                        ? category.requiredDocuments
                        : [],
                }));
                return cachedCategories;
            })
            .finally(() => {
                pendingCategories = undefined;
            });
    }

    return pendingCategories;
};

export const useBookingCategories = () => {
    const [state, setState] = useState<{
        data?: BookingCategory[];
        error?: string;
        loading: boolean;
    }>(() =>
        cachedCategories
            ? { data: cachedCategories, loading: false }
            : { loading: true },
    );
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;

        setState(current => ({ ...current, loading: !current.data }));

        loadBookingCategories()
            .then(data => {
                if (active) {
                    setState({ data, loading: false });
                }
            })
            .catch(error => {
                if (active) {
                    setState({
                        error: bookingErrorMessage(error, "categories"),
                        loading: false,
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [attempt]);

    const retry = useCallback(() => setAttempt(value => value + 1), []);

    return { ...state, retry };
};

// Lĩnh vực của thủ tục (danh mục DVC) → mã lĩnh vực đặt lịch. Ghép theo mã
// (code) để không phụ thuộc id trong database.
const FIELD_TO_CATEGORY_CODE: [string[], string][] = [
    [["ho tich", "nuoi con nuoi"], "HO_TICH"],
    [["chung thuc"], "CHUNG_THUC"],
    [
        [
            "dat dai",
            "tai chinh dat dai",
            "hoat dong xay dung",
            "quy hoach do thi va nong thon",
            "nha o va cong so",
        ],
        "DAT_DAI_XAY_DUNG",
    ],
    [
        [
            "bao tro xa hoi",
            "tre em",
            "giam ngheo",
            "phong, chong te nan xa hoi",
        ],
        "BAO_TRO_XAI_HOI",
    ],
    [["nguoi co cong"], "NGUOI_CO_CONG"],
    [["bao hiem"], "BHXH_BHYT"],
    [["an toan thuc pham"], "Y_TE"],
];

export const bookingCategoryCodeForField = (
    field: string | null | undefined,
): string | undefined => {
    if (!field) {
        return undefined;
    }

    const normalized = normalizeSearchText(field);

    return FIELD_TO_CATEGORY_CODE.find(([fields]) =>
        fields.includes(normalized),
    )?.[1];
};

// ---------------------------------------------------------------------------
// Khung giờ, đặt lịch, tra cứu, huỷ
// ---------------------------------------------------------------------------

export const getTodaySlots = (categoryId: number, signal?: AbortSignal) =>
    hccGet<BookingSlot[]>("slots", { params: { categoryId }, signal });

export const createAppointment = (input: CreateAppointmentInput) =>
    hccPost<CreatedAppointment>("appointments", {
        slotId: input.slotId,
        citizenName: input.citizenName,
        phone: input.phone,
        ...(input.citizenId ? { citizenId: input.citizenId } : {}),
    });

export const lookupAppointments = (phone: string, signal?: AbortSignal) =>
    hccGet<LookedUpAppointment[]>("appointments/lookup", {
        params: { phone },
        signal,
    });

export const cancelAppointment = (id: string, phone: string) =>
    hccPost<{ id: string; status: AppointmentStatus }>(
        `appointments/${encodeURIComponent(id)}/cancel`,
        { phone },
    );

// ---------------------------------------------------------------------------
// Kiểm tra dữ liệu nhập
// ---------------------------------------------------------------------------

/** Đưa SĐT về dạng 0xxxxxxxxx (bỏ khoảng trắng, dấu chấm, +84). */
export const normalizePhone = (value: string): string => {
    const digits = value.replace(/[\s().-]/g, "");

    return digits.startsWith("+84") ? `0${digits.slice(3)}` : digits;
};

export const isValidMobilePhone = (phone: string) =>
    /^0[35789]\d{8}$/.test(phone);

/** CCCD 12 số hoặc CMND 9 số. */
export const isValidCitizenId = (value: string) =>
    /^(\d{9}|\d{12})$/.test(value);

export const normalizeName = (value: string) =>
    value.trim().replace(/\s+/g, " ");

// ---------------------------------------------------------------------------
// Lỗi: backend trả message tiếng Anh nên đổi theo mã HTTP và ngữ cảnh
// ---------------------------------------------------------------------------

export const isSlotTakenError = (error: unknown) =>
    error instanceof HccApiError && error.status === 409;

export const isSlotGoneError = (error: unknown) =>
    error instanceof HccApiError && error.status === 404;

export const bookingErrorMessage = (
    error: unknown,
    action: BookingAction,
): string => {
    if (!(error instanceof HccApiError)) {
        return "Đã có lỗi xảy ra. Vui lòng thử lại.";
    }

    // Lỗi mạng/timeout của hccClient đã là tiếng Việt
    if (error.status === 0) {
        return error.message;
    }

    if (error.status === 429) {
        return "Bạn thao tác hơi nhanh. Vui lòng đợi một chút rồi thử lại.";
    }

    if (error.status >= 500) {
        return "Hệ thống đặt lịch đang gặp sự cố. Vui lòng thử lại sau.";
    }

    switch (action) {
        case "slots":
            return error.status === 404
                ? "Lĩnh vực này hiện không nhận đặt lịch."
                : "Không tải được khung giờ. Vui lòng thử lại.";
        case "create":
            if (error.status === 409) {
                return "Khung giờ này vừa hết chỗ. Vui lòng chọn khung giờ khác.";
            }
            if (error.status === 404) {
                return "Khung giờ không còn nhận đặt lịch (có thể đã sang ngày mới). Vui lòng chọn lại.";
            }
            return "Thông tin đặt lịch chưa hợp lệ. Vui lòng kiểm tra lại họ tên, số điện thoại và CCCD.";
        case "lookup":
            return error.status === 400
                ? "Số điện thoại chưa hợp lệ."
                : "Không tra cứu được lịch hẹn. Vui lòng thử lại.";
        case "cancel":
            if (error.status === 404) {
                return "Không tìm thấy lịch hẹn với số điện thoại này.";
            }
            if (error.status === 400) {
                return "Chỉ huỷ được lịch hẹn trong ngày hôm nay.";
            }
            if (error.status === 409) {
                return "Lịch hẹn đã được xử lý hoặc đã huỷ nên không thể huỷ nữa.";
            }
            return "Không huỷ được lịch hẹn. Vui lòng thử lại.";
        default:
            return "Không tải được danh sách lĩnh vực. Vui lòng thử lại.";
    }
};

// ---------------------------------------------------------------------------
// Ngày giờ theo giờ Việt Nam (backend dùng Asia/Ho_Chi_Minh)
// ---------------------------------------------------------------------------

const VN_TIME_ZONE = "Asia/Ho_Chi_Minh";
const WEEKDAYS = [
    "Chủ nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
];

const vnParts = (date: Date) => {
    try {
        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: VN_TIME_ZONE,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }).formatToParts(date);
        const value = (type: string) =>
            parts.find(part => part.type === type)?.value ?? "00";

        return {
            date: `${value("year")}-${value("month")}-${value("day")}`,
            time: `${value("hour")}:${value("minute")}`,
        };
    } catch {
        // Trình duyệt quá cũ không hỗ trợ timeZone: dùng giờ máy
        const pad = (value: number) => String(value).padStart(2, "0");

        return {
            date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
                date.getDate(),
            )}`,
            time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
        };
    }
};

/** Ngày hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD. */
export const todayInVietnam = () => vnParts(new Date()).date;

/** Giờ hiện tại theo giờ Việt Nam, dạng HH:mm. */
export const nowInVietnam = () => vnParts(new Date()).time;

/** bookingDate của backend là nửa đêm UTC, lấy phần ngày YYYY-MM-DD. */
export const bookingDay = (bookingDate: string) => bookingDate.slice(0, 10);

/** "Thứ Sáu, 13/11/2026" */
export const formatBookingDate = (bookingDate: string): string => {
    const day = bookingDay(bookingDate);
    const [year, month, date] = day.split("-").map(Number);

    if (!year || !month || !date) {
        return day;
    }

    const weekday =
        WEEKDAYS[new Date(Date.UTC(year, month - 1, date)).getUTCDay()];

    return `${weekday}, ${String(date).padStart(2, "0")}/${String(
        month,
    ).padStart(2, "0")}/${year}`;
};
