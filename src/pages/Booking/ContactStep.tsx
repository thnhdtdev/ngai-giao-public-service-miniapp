import { UserRound } from "lucide-react";
import React, { useState } from "react";
import { getUserInfo } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

export type ContactForm = {
    citizenName: string;
    phone: string;
    citizenId: string;
};

export type ContactErrors = Partial<Record<keyof ContactForm, string>>;

type ContactStepProps = {
    form: ContactForm;
    errors: ContactErrors;
    showAllErrors: boolean;
    onChange: (field: keyof ContactForm, value: string) => void;
};

const inputClassName =
    "mt-1.5 block h-12 w-full rounded-xl border bg-white px-4 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const Field: React.FC<{
    id: string;
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}> = ({ id, label, hint, error, children, action }) => (
    <div>
        <div className="flex items-end justify-between gap-2">
            <label className="text-sm font-semibold text-gray-800" htmlFor={id}>
                {label}
            </label>
            {action}
        </div>
        {children}
        {error ? (
            <p className="m-0 mt-1 text-xs font-medium text-red-600">{error}</p>
        ) : (
            hint && <p className="m-0 mt-1 text-xs text-gray-500">{hint}</p>
        )}
    </div>
);

const ContactStep: React.FC<ContactStepProps> = ({
    form,
    errors,
    showAllErrors,
    onChange,
}) => {
    const { openSnackbar } = useSnackbar();
    const [touched, setTouched] = useState<
        Partial<Record<keyof ContactForm, boolean>>
    >({});
    const [loadingName, setLoadingName] = useState(false);

    const errorFor = (field: keyof ContactForm) =>
        showAllErrors || touched[field] ? errors[field] : undefined;

    const touch = (field: keyof ContactForm) =>
        setTouched(current => ({ ...current, [field]: true }));

    // Theo NĐ 13/2023, tên Zalo chỉ lấy khi người dùng đồng ý
    const handleUseZaloName = async () => {
        setLoadingName(true);

        try {
            const { userInfo } = await getUserInfo({
                autoRequestPermission: true,
            });
            const name = userInfo?.name?.trim();

            if (name) {
                onChange("citizenName", name);
            } else {
                openSnackbar({
                    text: "Không lấy được tên Zalo, vui lòng nhập tay.",
                    type: "info",
                    duration: 2500,
                });
            }
        } catch {
            openSnackbar({
                text: "Chưa được phép lấy tên Zalo, vui lòng nhập tay.",
                type: "info",
                duration: 2500,
            });
        } finally {
            setLoadingName(false);
        }
    };

    const borderFor = (field: keyof ContactForm) =>
        errorFor(field) ? "border-red-300" : "border-gray-200";

    return (
        <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
            <Field
                action={
                    <button
                        className="flex items-center gap-1 border-0 bg-transparent p-0 text-xs font-semibold text-blue-600 active:opacity-70 disabled:opacity-50"
                        disabled={loadingName}
                        type="button"
                        onClick={handleUseZaloName}
                    >
                        <UserRound className="h-3.5 w-3.5" />
                        Dùng tên Zalo
                    </button>
                }
                error={errorFor("citizenName")}
                id="booking-name"
                label="Họ và tên *"
            >
                <input
                    autoComplete="name"
                    className={`${inputClassName} ${borderFor("citizenName")}`}
                    id="booking-name"
                    maxLength={100}
                    placeholder="Nguyễn Văn A"
                    value={form.citizenName}
                    onBlur={() => touch("citizenName")}
                    onChange={event =>
                        onChange("citizenName", event.target.value)
                    }
                />
            </Field>

            <Field
                error={errorFor("phone")}
                hint="Dùng để tra cứu và huỷ lịch hẹn."
                id="booking-phone"
                label="Số điện thoại *"
            >
                <input
                    autoComplete="tel"
                    className={`${inputClassName} ${borderFor("phone")}`}
                    id="booking-phone"
                    inputMode="tel"
                    maxLength={16}
                    placeholder="0912 345 678"
                    type="tel"
                    value={form.phone}
                    onBlur={() => touch("phone")}
                    onChange={event => onChange("phone", event.target.value)}
                />
            </Field>

            <Field
                error={errorFor("citizenId")}
                hint="Không bắt buộc. Giúp cán bộ tiếp nhận nhanh hơn."
                id="booking-citizen-id"
                label="Số CCCD"
            >
                <input
                    className={`${inputClassName} ${borderFor("citizenId")}`}
                    id="booking-citizen-id"
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="12 chữ số"
                    value={form.citizenId}
                    onBlur={() => touch("citizenId")}
                    onChange={event =>
                        onChange(
                            "citizenId",
                            event.target.value.replace(/\D/g, ""),
                        )
                    }
                />
            </Field>
        </div>
    );
};

export default ContactStep;
