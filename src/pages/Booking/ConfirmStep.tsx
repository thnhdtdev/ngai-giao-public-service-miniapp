import { AlertCircle, FileText, Info, TriangleAlert } from "lucide-react";
import React from "react";

import {
    BookingCategory,
    BookingSlot,
    formatBookingDate,
    todayInVietnam,
} from "@api/appointments";

import { SavedAppointment } from "./bookingStorage";
import { ContactForm } from "./ContactStep";
import { InfoRow, RequiredDocuments } from "./shared";

type ConfirmStepProps = {
    category: BookingCategory;
    slot: BookingSlot;
    contact: ContactForm;
    duplicate?: SavedAppointment;
    submitError?: string;
};

const ConfirmStep: React.FC<ConfirmStepProps> = ({
    category,
    slot,
    contact,
    duplicate,
    submitError,
}) => (
    <div className="space-y-4">
        {submitError && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-5 text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {submitError}
            </div>
        )}

        {duplicate && (
            <div className="flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm leading-5 text-amber-800">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                    Số điện thoại này đã có lịch hẹn{" "}
                    <strong>{duplicate.bookingCode}</strong> lúc{" "}
                    {duplicate.startTime} hôm nay cho lĩnh vực này. Bạn vẫn có
                    thể đặt thêm nếu cần.
                </span>
            </div>
        )}

        <section className="rounded-2xl bg-white px-4 py-2 shadow-sm">
            <div className="divide-y divide-gray-100">
                <InfoRow label="Lĩnh vực" value={category.name} />
                <InfoRow
                    label="Ngày"
                    value={formatBookingDate(todayInVietnam())}
                />
                <InfoRow
                    label="Khung giờ"
                    value={
                        <span className="text-blue-700">
                            {slot.startTime} – {slot.endTime}
                        </span>
                    }
                />
                <InfoRow label="Họ và tên" value={contact.citizenName} />
                <InfoRow label="Số điện thoại" value={contact.phone} />
                {contact.citizenId && (
                    <InfoRow label="Số CCCD" value={contact.citizenId} />
                )}
            </div>
        </section>

        {category.requiredDocuments.length > 0 && (
            <section className="rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="m-0 mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Giấy tờ cần mang theo
                </h3>
                <RequiredDocuments documents={category.requiredDocuments} />
            </section>
        )}

        <div className="flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-5 text-blue-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <span>
                Lịch hẹn chỉ có giá trị trong hôm nay. Vui lòng đến trước giờ
                hẹn khoảng 10 phút và đọc mã lịch hẹn cho cán bộ tiếp nhận.
            </span>
        </div>
    </div>
);

export default ConfirmStep;
