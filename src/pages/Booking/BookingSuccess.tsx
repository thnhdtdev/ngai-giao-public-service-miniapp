import { CalendarCheck, CheckCircle2, FileText, MapPin } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import {
    BookingCategory,
    CreatedAppointment,
    formatBookingDate,
} from "@api/appointments";

import { CopyCodeButton, InfoRow, RequiredDocuments } from "./shared";

type BookingSuccessProps = {
    appointment: CreatedAppointment;
    category?: BookingCategory;
};

const BookingSuccess: React.FC<BookingSuccessProps> = ({
    appointment,
    category,
}) => {
    const navigate = useNavigate();
    const { slot } = appointment;

    return (
        <main className="px-4 pb-8 pt-5">
            <section className="rounded-3xl bg-white p-5 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-9 w-9" />
                </div>
                <h2 className="mt-3 text-xl font-bold text-gray-900">
                    Đặt lịch thành công
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Vui lòng đọc mã này cho cán bộ khi đến Trung tâm
                </p>

                <div className="mt-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-4 py-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        Mã lịch hẹn
                    </div>
                    <div
                        className="mt-1 text-3xl font-extrabold tracking-wider text-blue-700"
                        data-testid="booking-code"
                    >
                        {appointment.bookingCode}
                    </div>
                    <CopyCodeButton
                        className="mx-auto mt-2 bg-white text-blue-700"
                        code={appointment.bookingCode}
                    />
                </div>

                <div className="mt-4 divide-y divide-gray-100 text-left">
                    <InfoRow label="Lĩnh vực" value={slot.category.name} />
                    <InfoRow
                        label="Ngày"
                        value={formatBookingDate(slot.bookingDate)}
                    />
                    <InfoRow
                        label="Khung giờ"
                        value={
                            <span className="text-blue-700">
                                {slot.startTime} – {slot.endTime}
                            </span>
                        }
                    />
                    <InfoRow
                        label="Người đặt"
                        value={appointment.citizenName}
                    />
                </div>
            </section>

            {category && category.requiredDocuments.length > 0 && (
                <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <h3 className="m-0 mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Giấy tờ cần mang theo
                    </h3>
                    <RequiredDocuments documents={category.requiredDocuments} />
                </section>
            )}

            <p className="mx-1 mt-4 text-center text-xs leading-5 text-gray-500">
                Vui lòng đến trước giờ hẹn khoảng 10 phút. Nếu không đến được,
                hãy huỷ lịch để nhường chỗ cho người khác.
            </p>

            <div className="mt-4 space-y-2.5">
                <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-blue-600 px-4 py-3 text-sm font-bold text-white active:bg-blue-700"
                    type="button"
                    onClick={() => navigate("/appointments", { replace: true })}
                >
                    <CalendarCheck className="h-4 w-4" />
                    Xem lịch hẹn của tôi
                </button>
                <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 active:bg-gray-50"
                    type="button"
                    onClick={() => navigate("/location")}
                >
                    <MapPin className="h-4 w-4" />
                    Chỉ đường đến Trung tâm
                </button>
            </div>
        </main>
    );
};

export default BookingSuccess;
