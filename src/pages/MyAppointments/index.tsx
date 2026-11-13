import {
    CalendarPlus,
    CalendarX2,
    Clock3,
    RotateCw,
    Search,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, useSnackbar } from "zmp-ui";

import {
    bookingErrorMessage,
    cancelAppointment,
    formatBookingDate,
    isValidMobilePhone,
    lookupAppointments,
    normalizePhone,
    todayInVietnam,
} from "@api/appointments";
import { HccApiError } from "@api/hccClient";
import PageLayout from "@components/layout/PageLayout";

import {
    readSavedAppointments,
    readSavedContact,
    SavedAppointment,
    toSavedAppointment,
    updateSavedStatus,
    upsertSavedAppointments,
} from "../Booking/bookingStorage";
import { CopyCodeButton, StatusBadge } from "../Booking/shared";

const PAGE_TITLE = "Lịch hẹn của tôi";

/** Tra cứu lịch hôm nay theo từng SĐT rồi lưu lại. Lỗi một SĐT không chặn SĐT khác. */
const refreshPhones = async (phones: string[]) => {
    const results = await Promise.allSettled(
        phones.map(async phone =>
            (
                await lookupAppointments(phone)
            ).map(item => toSavedAppointment(item, phone)),
        ),
    );
    const found = results.flatMap(result =>
        result.status === "fulfilled" ? result.value : [],
    );
    const failed = results.some(result => result.status === "rejected");

    return { items: upsertSavedAppointments(found), found, failed };
};

type AppointmentCardProps = {
    item: SavedAppointment;
    today: string;
    cancelling: boolean;
    onCancel: (item: SavedAppointment) => void;
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
    item,
    today,
    cancelling,
    onCancel,
}) => {
    const isToday = item.bookingDate === today;
    const expired = item.status === "PENDING" && item.bookingDate < today;

    return (
        <article
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            data-testid="appointment-card"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Mã lịch hẹn
                    </div>
                    <div className="text-xl font-extrabold tracking-wide text-blue-700">
                        {item.bookingCode}
                    </div>
                </div>
                <StatusBadge expired={expired} status={item.status} />
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-gray-700">
                <div className="font-semibold text-gray-900">
                    {item.categoryName}
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>
                        <strong className="text-gray-900">
                            {item.startTime} – {item.endTime}
                        </strong>
                        {" · "}
                        {formatBookingDate(item.bookingDate)}
                    </span>
                </div>
                <div className="text-gray-500">
                    Người đặt: {item.citizenName}
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                <CopyCodeButton
                    className="bg-gray-50 text-gray-700"
                    code={item.bookingCode}
                />
                {isToday && item.status === "PENDING" && (
                    <button
                        className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 active:bg-red-50 disabled:opacity-50"
                        disabled={cancelling}
                        type="button"
                        onClick={() => onCancel(item)}
                    >
                        {cancelling ? "Đang huỷ…" : "Huỷ lịch"}
                    </button>
                )}
            </div>
        </article>
    );
};

const MyAppointmentsPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const [items, setItems] = useState<SavedAppointment[]>(
        readSavedAppointments,
    );
    const [refreshing, setRefreshing] = useState(false);
    const [refreshFailed, setRefreshFailed] = useState(false);
    const [lookupPhone, setLookupPhone] = useState(
        () => readSavedContact()?.phone ?? "",
    );
    const [lookingUp, setLookingUp] = useState(false);
    const [lookupError, setLookupError] = useState<string>();
    const [confirmTarget, setConfirmTarget] = useState<SavedAppointment>();
    const [cancellingId, setCancellingId] = useState<string>();

    const today = todayInVietnam();
    const todayItems = useMemo(
        () => items.filter(item => item.bookingDate === today),
        [items, today],
    );
    const pastItems = useMemo(
        () => items.filter(item => item.bookingDate !== today),
        [items, today],
    );

    // Cập nhật trạng thái lịch hôm nay (backend chỉ tra cứu được lịch trong ngày)
    const refresh = useCallback(async () => {
        const phones = Array.from(
            new Set(
                [
                    ...readSavedAppointments()
                        .filter(item => item.bookingDate === todayInVietnam())
                        .map(item => item.phone),
                    readSavedContact()?.phone,
                ].filter((phone): phone is string => Boolean(phone)),
            ),
        );

        if (phones.length === 0) {
            return;
        }

        setRefreshing(true);
        const result = await refreshPhones(phones);
        setItems(result.items);
        setRefreshFailed(result.failed);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const handleLookup = async (event: React.FormEvent) => {
        event.preventDefault();
        const phone = normalizePhone(lookupPhone);

        if (!isValidMobilePhone(phone)) {
            setLookupError(
                "Số di động chưa đúng: cần 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09.",
            );
            return;
        }

        setLookupError(undefined);
        setLookingUp(true);

        try {
            const found = (await lookupAppointments(phone)).map(item =>
                toSavedAppointment(item, phone),
            );
            setItems(upsertSavedAppointments(found));
            openSnackbar({
                text: found.length
                    ? `Tìm thấy ${found.length} lịch hẹn hôm nay`
                    : "Số điện thoại này chưa có lịch hẹn nào hôm nay",
                type: found.length ? "success" : "info",
                duration: 2500,
            });
        } catch (error) {
            setLookupError(bookingErrorMessage(error, "lookup"));
        } finally {
            setLookingUp(false);
        }
    };

    const handleConfirmCancel = async () => {
        const target = confirmTarget;
        setConfirmTarget(undefined);

        if (!target) {
            return;
        }

        setCancellingId(target.id);

        try {
            await cancelAppointment(target.id, target.phone);
            setItems(updateSavedStatus(target.id, "CANCELLED"));
            openSnackbar({
                text: `Đã huỷ lịch hẹn ${target.bookingCode}`,
                type: "success",
                duration: 2500,
            });
        } catch (error) {
            openSnackbar({
                text: bookingErrorMessage(error, "cancel"),
                type: "error",
                duration: 3500,
            });

            // Lịch đã đổi trạng thái ở phía Trung tâm: tải lại để hiện đúng
            if (error instanceof HccApiError && error.status === 409) {
                refresh();
            }
        } finally {
            setCancellingId(undefined);
        }
    };

    const renderList = (list: SavedAppointment[]) => (
        <div className="space-y-3">
            {list.map(item => (
                <AppointmentCard
                    cancelling={cancellingId === item.id}
                    item={item}
                    key={item.id}
                    today={today}
                    onCancel={setConfirmTarget}
                />
            ))}
        </div>
    );

    return (
        <PageLayout
            className="bg-gray-50"
            name="my-appointments"
            title={PAGE_TITLE}
        >
            <main className="px-4 pb-8 pt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="m-0 text-base font-bold text-gray-900">
                        Hôm nay
                    </h2>
                    <button
                        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 active:bg-gray-50 disabled:opacity-60"
                        disabled={refreshing}
                        type="button"
                        onClick={refresh}
                    >
                        <RotateCw
                            className={`h-3.5 w-3.5 ${
                                refreshing ? "animate-spin" : ""
                            }`}
                        />
                        Cập nhật
                    </button>
                </div>

                {refreshFailed && (
                    <p className="m-0 mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        Chưa cập nhật được trạng thái mới nhất. Thông tin bên
                        dưới có thể đã cũ.
                    </p>
                )}

                {todayItems.length > 0 ? (
                    renderList(todayItems)
                ) : (
                    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <CalendarX2 className="h-6 w-6" />
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                            Bạn chưa có lịch hẹn nào hôm nay.
                        </p>
                    </div>
                )}

                <button
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-blue-600 px-4 py-3 text-sm font-bold text-white active:bg-blue-700"
                    type="button"
                    onClick={() => navigate("/booking")}
                >
                    <CalendarPlus className="h-4 w-4" />
                    Đặt lịch hẹn mới
                </button>

                <form
                    className="mt-6 rounded-2xl bg-white p-4 shadow-sm"
                    onSubmit={handleLookup}
                >
                    <h3 className="m-0 text-sm font-bold text-gray-900">
                        Đã đặt lịch trên website?
                    </h3>
                    <p className="m-0 mt-0.5 text-xs text-gray-500">
                        Nhập số điện thoại đã dùng để xem lịch hẹn hôm nay.
                    </p>
                    <div className="mt-3 flex gap-2">
                        <input
                            aria-label="Số điện thoại đã đặt lịch"
                            className="h-11 min-w-0 flex-1 rounded-xl border border-gray-200 px-3 text-base text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            id="lookup-phone"
                            inputMode="tel"
                            maxLength={16}
                            placeholder="0912 345 678"
                            type="tel"
                            value={lookupPhone}
                            onChange={event =>
                                setLookupPhone(event.target.value)
                            }
                        />
                        <button
                            className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border-0 bg-gray-900 px-4 text-sm font-semibold text-white active:bg-gray-700 disabled:opacity-60"
                            disabled={lookingUp}
                            type="submit"
                        >
                            <Search className="h-4 w-4" />
                            Tra cứu
                        </button>
                    </div>
                    {lookupError && (
                        <p className="m-0 mt-2 text-xs font-medium text-red-600">
                            {lookupError}
                        </p>
                    )}
                </form>

                {pastItems.length > 0 && (
                    <>
                        <h2 className="mb-3 mt-6 text-base font-bold text-gray-900">
                            Trước đây
                        </h2>
                        {renderList(pastItems)}
                    </>
                )}
            </main>

            <Modal
                actions={[
                    { text: "Không", close: true },
                    {
                        text: "Huỷ lịch",
                        danger: true,
                        onClick: handleConfirmCancel,
                    },
                ]}
                description={
                    confirmTarget
                        ? `Huỷ lịch hẹn ${confirmTarget.bookingCode} lúc ${confirmTarget.startTime} hôm nay? Chỗ của bạn sẽ được nhường cho người khác.`
                        : undefined
                }
                title="Huỷ lịch hẹn?"
                visible={Boolean(confirmTarget)}
                onClose={() => setConfirmTarget(undefined)}
            />
        </PageLayout>
    );
};

export default MyAppointmentsPage;

export { MyAppointmentsPage };
