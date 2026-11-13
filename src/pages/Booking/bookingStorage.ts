import { nativeStorage } from "zmp-sdk";

import {
    AppointmentStatus,
    bookingDay,
    CreatedAppointment,
    LookedUpAppointment,
    todayInVietnam,
} from "@api/appointments";

// Lưu lịch hẹn đã đặt ngay trên máy để người dân xem lại / huỷ mà không
// phải nhập lại số điện thoại. KHÔNG lưu số CCCD.

const APPOINTMENTS_KEY = "booking:appointments:v1";
const CONTACT_KEY = "booking:contact:v1";
const MAX_SAVED = 30;
const KEEP_DAYS = 30;

export type SavedAppointment = {
    id: string;
    bookingCode: string;
    citizenName: string;
    phone: string;
    status: AppointmentStatus;
    bookingDate: string; // YYYY-MM-DD
    startTime: string;
    endTime: string;
    categoryCode: string;
    categoryName: string;
};

export type SavedContact = { citizenName: string; phone: string };

// nativeStorage chỉ có trong Zalo; chạy trên trình duyệt (dev) thì dùng
// localStorage. Mọi lỗi đọc/ghi đều bỏ qua để không làm hỏng luồng đặt lịch.
const storage = {
    get(key: string): string | null {
        try {
            return nativeStorage.getItem(key) || null;
        } catch {
            try {
                return window.localStorage.getItem(key);
            } catch {
                return null;
            }
        }
    },
    set(key: string, value: string) {
        try {
            nativeStorage.setItem(key, value);
        } catch {
            try {
                window.localStorage.setItem(key, value);
            } catch {
                // Không lưu được thì thôi
            }
        }
    },
};

const readJson = <T>(key: string): T | undefined => {
    const raw = storage.get(key);

    if (!raw) {
        return undefined;
    }

    try {
        return JSON.parse(raw) as T;
    } catch {
        return undefined;
    }
};

const isSavedAppointment = (value: unknown): value is SavedAppointment => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const item = value as Record<string, unknown>;

    return [
        "id",
        "bookingCode",
        "phone",
        "status",
        "bookingDate",
        "startTime",
    ].every(key => typeof item[key] === "string");
};

const daysAgo = (days: number) => {
    const date = new Date(`${todayInVietnam()}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - days);
    return date.toISOString().slice(0, 10);
};

/** Mới nhất trước. Bỏ mục hỏng và mục cũ hơn 30 ngày. */
export const readSavedAppointments = (): SavedAppointment[] => {
    const items = readJson<unknown[]>(APPOINTMENTS_KEY);
    const oldest = daysAgo(KEEP_DAYS);

    return (Array.isArray(items) ? items : [])
        .filter(isSavedAppointment)
        .filter(item => item.bookingDate >= oldest)
        .sort((a, b) =>
            `${b.bookingDate} ${b.startTime}`.localeCompare(
                `${a.bookingDate} ${a.startTime}`,
            ),
        );
};

const writeSavedAppointments = (items: SavedAppointment[]) => {
    storage.set(APPOINTMENTS_KEY, JSON.stringify(items.slice(0, MAX_SAVED)));
};

export const toSavedAppointment = (
    appointment: CreatedAppointment | LookedUpAppointment,
    phone: string,
): SavedAppointment => ({
    id: appointment.id,
    bookingCode: appointment.bookingCode,
    citizenName: appointment.citizenName,
    phone,
    status: appointment.status,
    bookingDate: bookingDay(appointment.slot.bookingDate),
    startTime: appointment.slot.startTime,
    endTime: appointment.slot.endTime,
    categoryCode: appointment.slot.category.code,
    categoryName: appointment.slot.category.name,
});

/** Thêm mới hoặc cập nhật theo id, trả về danh sách sau khi lưu. */
export const upsertSavedAppointments = (
    updates: SavedAppointment[],
): SavedAppointment[] => {
    const byId = new Map(readSavedAppointments().map(item => [item.id, item]));

    updates.forEach(update =>
        byId.set(update.id, { ...byId.get(update.id), ...update }),
    );

    const next = Array.from(byId.values()).sort((a, b) =>
        `${b.bookingDate} ${b.startTime}`.localeCompare(
            `${a.bookingDate} ${a.startTime}`,
        ),
    );

    writeSavedAppointments(next);

    return next;
};

export const updateSavedStatus = (id: string, status: AppointmentStatus) => {
    const item = readSavedAppointments().find(entry => entry.id === id);

    return item
        ? upsertSavedAppointments([{ ...item, status }])
        : readSavedAppointments();
};

export const readSavedContact = (): SavedContact | undefined => {
    const contact = readJson<SavedContact>(CONTACT_KEY);

    return contact &&
        typeof contact.citizenName === "string" &&
        typeof contact.phone === "string"
        ? contact
        : undefined;
};

export const saveContact = (contact: SavedContact) => {
    storage.set(CONTACT_KEY, JSON.stringify(contact));
};

/** Lịch đang chờ hôm nay cùng SĐT và cùng lĩnh vực (để cảnh báo đặt trùng). */
export const findPendingToday = (phone: string, categoryCode: string) =>
    readSavedAppointments().find(
        item =>
            item.phone === phone &&
            item.categoryCode === categoryCode &&
            item.status === "PENDING" &&
            item.bookingDate === todayInVietnam(),
    );
