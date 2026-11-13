import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { useSnackbar } from "zmp-ui";

import {
    AppointmentStatus,
    APPOINTMENT_STATUS_LABELS,
} from "@api/appointments";
import { copyText } from "@utils/clipboard";

export const STEP_LABELS = ["Lĩnh vực", "Khung giờ", "Thông tin", "Xác nhận"];

export const Stepper: React.FC<{ step: number }> = ({ step }) => (
    <ol className="m-0 flex list-none items-start gap-1 p-0">
        {STEP_LABELS.map((label, index) => {
            const number = index + 1;
            const done = number < step;
            const active = number === step;

            return (
                <li
                    className="flex min-w-0 flex-1 flex-col items-center"
                    key={label}
                >
                    <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            done || active
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-500"
                        } ${active ? "ring-4 ring-blue-100" : ""}`}
                    >
                        {done ? <Check className="h-4 w-4" /> : number}
                    </span>
                    <span
                        className={`mt-1 text-center text-[11px] font-semibold leading-4 ${
                            active ? "text-blue-700" : "text-gray-500"
                        }`}
                    >
                        {label}
                    </span>
                </li>
            );
        })}
    </ol>
);

export const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
    label,
    value,
}) => (
    <div className="flex items-start justify-between gap-4 py-2.5">
        <span className="shrink-0 text-sm text-gray-500">{label}</span>
        <span className="min-w-0 text-right text-sm font-semibold text-gray-900">
            {value}
        </span>
    </div>
);

const STATUS_STYLES: Record<AppointmentStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    MISSED: "bg-gray-100 text-gray-600 border-gray-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-100",
};

export const StatusBadge: React.FC<{
    status: AppointmentStatus;
    expired?: boolean;
}> = ({ status, expired }) => (
    <span
        className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            expired ? STATUS_STYLES.MISSED : STATUS_STYLES[status]
        }`}
    >
        {expired ? "Đã qua" : APPOINTMENT_STATUS_LABELS[status]}
    </span>
);

export const CopyCodeButton: React.FC<{ code: string; className?: string }> = ({
    code,
    className = "",
}) => {
    const { openSnackbar } = useSnackbar();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const ok = await copyText(code);

        if (ok) {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        }

        openSnackbar({
            text: ok
                ? `Đã sao chép mã ${code}`
                : "Không sao chép được, vui lòng ghi lại mã.",
            type: ok ? "success" : "error",
            duration: 2000,
        });
    };

    return (
        <button
            aria-label={`Sao chép mã ${code}`}
            className={`flex items-center gap-1.5 rounded-lg border-0 px-2.5 py-1.5 text-xs font-semibold active:opacity-70 ${className}`}
            type="button"
            onClick={handleCopy}
        >
            {copied ? (
                <Check className="h-3.5 w-3.5" />
            ) : (
                <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Đã chép" : "Sao chép"}
        </button>
    );
};

export const RequiredDocuments: React.FC<{ documents: string[] }> = ({
    documents,
}) =>
    documents.length > 0 ? (
        <ul className="m-0 list-none space-y-1.5 p-0">
            {documents.map(document => (
                <li
                    className="flex items-start gap-2 text-sm leading-5 text-gray-700"
                    key={document}
                >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {document}
                </li>
            ))}
        </ul>
    ) : null;
