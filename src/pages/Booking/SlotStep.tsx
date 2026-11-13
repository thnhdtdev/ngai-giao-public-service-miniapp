import { CalendarX2, Phone, RotateCw } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { openPhone } from "zmp-sdk";

import {
    BookingCategory,
    BookingSlot,
    bookingErrorMessage,
    formatBookingDate,
    getTodaySlots,
    nowInVietnam,
    todayInVietnam,
} from "@api/appointments";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";

const REFRESH_INTERVAL_MS = 60_000;
const CLOCK_INTERVAL_MS = 30_000;

/** Khung giờ còn chỗ hôm nay; tự tải lại mỗi phút, ẩn khung đã qua giờ. */
const useTodaySlots = (categoryId: number, reloadKey: number) => {
    const [state, setState] = useState<{
        slots?: BookingSlot[];
        error?: string;
        loading: boolean;
    }>({ loading: true });
    const [now, setNow] = useState(nowInVietnam);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        setState(current => ({ ...current, loading: !current.slots }));

        getTodaySlots(categoryId, controller.signal)
            .then(slots => setState({ slots, loading: false }))
            .catch(error => {
                if (!controller.signal.aborted) {
                    setState(current => ({
                        // Lần làm mới định kỳ lỗi thì giữ danh sách cũ
                        slots: current.slots,
                        error: current.slots
                            ? undefined
                            : bookingErrorMessage(error, "slots"),
                        loading: false,
                    }));
                }
            });

        return () => controller.abort();
    }, [categoryId, reloadKey, tick]);

    useEffect(() => {
        const refresh = window.setInterval(
            () => setTick(value => value + 1),
            REFRESH_INTERVAL_MS,
        );
        const clock = window.setInterval(
            () => setNow(nowInVietnam()),
            CLOCK_INTERVAL_MS,
        );

        return () => {
            window.clearInterval(refresh);
            window.clearInterval(clock);
        };
    }, []);

    const slots = useMemo(
        () =>
            state.slots?.filter(
                slot =>
                    slot.startTime > now && slot.bookedCount < slot.maxCapacity,
            ),
        [state.slots, now],
    );

    const reload = useCallback(() => {
        setState({ loading: true });
        setTick(value => value + 1);
    }, []);

    return { slots, error: state.error, loading: state.loading, reload };
};

type SlotStepProps = {
    category: BookingCategory;
    selectedSlotId?: number;
    reloadKey: number;
    onSelect: (slot: BookingSlot | undefined) => void;
};

const SlotStep: React.FC<SlotStepProps> = ({
    category,
    selectedSlotId,
    reloadKey,
    onSelect,
}) => {
    const navigate = useNavigate();
    const { slots, error, loading, reload } = useTodaySlots(
        category.id,
        reloadKey,
    );

    // Khung đang chọn vừa hết chỗ / qua giờ thì bỏ chọn
    useEffect(() => {
        if (
            slots &&
            selectedSlotId !== undefined &&
            !slots.some(slot => slot.id === selectedSlotId)
        ) {
            onSelect(undefined);
        }
    }, [slots, selectedSlotId, onSelect]);

    const { hotline } = NGAI_GIAO_ORGANIZATION.organization;

    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Hôm nay
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                        {formatBookingDate(todayInVietnam())}
                    </div>
                </div>
                <button
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 active:bg-gray-50"
                    disabled={loading}
                    type="button"
                    onClick={reload}
                >
                    <RotateCw
                        className={`h-3.5 w-3.5 ${
                            loading ? "animate-spin" : ""
                        }`}
                    />
                    Làm mới
                </button>
            </div>

            {loading && !slots && (
                <div className="grid grid-cols-2 gap-2.5">
                    {[0, 1, 2, 3, 4, 5].map(item => (
                        <div
                            className="h-16 animate-pulse rounded-xl bg-white shadow-sm"
                            key={item}
                        />
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
                    <p className="m-0 text-sm text-gray-600">{error}</p>
                    <button
                        className="mx-auto mt-4 flex items-center gap-2 rounded-xl border-0 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-blue-700"
                        type="button"
                        onClick={reload}
                    >
                        <RotateCw className="h-4 w-4" />
                        Thử lại
                    </button>
                </div>
            )}

            {slots && slots.length === 0 && (
                <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                        <CalendarX2 className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-base font-bold text-gray-900">
                        Hôm nay đã hết khung giờ
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-gray-600">
                        Lịch hẹn chỉ đặt được trong ngày. Bạn vui lòng quay lại
                        vào ngày làm việc tiếp theo, hoặc nộp hồ sơ trực tuyến.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 active:bg-gray-50"
                            type="button"
                            onClick={() => navigate("/procedures")}
                        >
                            Tra cứu thủ tục
                        </button>
                        <button
                            className="flex items-center justify-center gap-1.5 rounded-xl border-0 bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white active:bg-blue-700"
                            type="button"
                            onClick={() =>
                                openPhone({
                                    phoneNumber: hotline.phoneNumber,
                                }).catch(() => undefined)
                            }
                        >
                            <Phone className="h-4 w-4" />
                            Gọi hotline
                        </button>
                    </div>
                </div>
            )}

            {slots && slots.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                    {slots.map(slot => {
                        const selected = slot.id === selectedSlotId;
                        const remaining = slot.maxCapacity - slot.bookedCount;
                        let remainingColor = "text-emerald-600";

                        if (selected) {
                            remainingColor = "text-blue-100";
                        } else if (remaining <= 1) {
                            remainingColor = "text-amber-600";
                        }

                        return (
                            <button
                                aria-pressed={selected}
                                className={`rounded-xl border p-3 text-left shadow-sm active:opacity-80 ${
                                    selected
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-gray-100 bg-white text-gray-900"
                                }`}
                                key={slot.id}
                                type="button"
                                onClick={() => onSelect(slot)}
                            >
                                <span className="block text-base font-bold">
                                    {slot.startTime} – {slot.endTime}
                                </span>
                                <span
                                    className={`mt-0.5 block text-xs font-medium ${remainingColor}`}
                                >
                                    Còn {remaining} chỗ
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SlotStep;
