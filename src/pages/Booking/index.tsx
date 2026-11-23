import { CalendarCheck, ChevronRight, LoaderCircle } from "lucide-react";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "zmp-ui";

import {
    BookingCategory,
    BookingSlot,
    bookingErrorMessage,
    createAppointment,
    CreatedAppointment,
    isSlotGoneError,
    isSlotTakenError,
    isValidCitizenId,
    isValidMobilePhone,
    normalizeName,
    normalizePhone,
    todayInVietnam,
    useBookingCategories,
} from "@api/appointments";
import PageLayout from "@components/layout/PageLayout";

import BookingSuccess from "./BookingSuccess";
import {
    findPendingToday,
    readSavedAppointments,
    readSavedContact,
    saveContact,
    toSavedAppointment,
    upsertSavedAppointments,
} from "./bookingStorage";
import CategoryStep from "./CategoryStep";
import ConfirmStep from "./ConfirmStep";
import ContactStep, { ContactErrors, ContactForm } from "./ContactStep";
import { Stepper } from "./shared";
import SlotStep from "./SlotStep";

type Step = 1 | 2 | 3 | 4;

const PAGE_TITLE = "Đặt lịch hẹn";

const STEP_DESCRIPTIONS: Record<Step, string> = {
    1: "Chọn lĩnh vực bạn cần làm thủ tục",
    2: "Chọn khung giờ còn chỗ trong hôm nay",
    3: "Nhập thông tin người đến làm thủ tục",
    4: "Kiểm tra lại trước khi xác nhận",
};

const validateContact = (form: ContactForm): ContactErrors => {
    const errors: ContactErrors = {};
    const name = normalizeName(form.citizenName);
    const phone = normalizePhone(form.phone);
    const citizenId = form.citizenId.trim();

    if (name.length < 2) {
        errors.citizenName = "Vui lòng nhập họ và tên.";
    }

    if (!phone) {
        errors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!isValidMobilePhone(phone)) {
        errors.phone =
            "Số di động chưa đúng: cần 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09.";
    }

    if (citizenId && !isValidCitizenId(citizenId)) {
        errors.citizenId = "Số CCCD gồm 12 chữ số (CMND cũ: 9 chữ số).";
    }

    return errors;
};

const initialContact = (): ContactForm => {
    const saved = readSavedContact();

    return {
        citizenName: saved?.citizenName ?? "",
        phone: saved?.phone ?? "",
        citizenId: "",
    };
};

const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const [searchParams] = useSearchParams();
    const pageRef = useRef<HTMLDivElement>(null);
    const submittingRef = useRef(false);
    const preselectApplied = useRef(false);

    const categories = useBookingCategories();
    const [step, setStep] = useState<Step>(1);
    const [category, setCategory] = useState<BookingCategory>();
    const [slot, setSlot] = useState<BookingSlot>();
    const [slotReloadKey, setSlotReloadKey] = useState(0);
    const [form, setForm] = useState<ContactForm>(initialContact);
    const [showAllErrors, setShowAllErrors] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string>();
    const [result, setResult] = useState<CreatedAppointment>();

    const todayPendingCount = useMemo(
        () =>
            readSavedAppointments().filter(
                item =>
                    item.status === "PENDING" &&
                    item.bookingDate === todayInVietnam(),
            ).length,
        [],
    );

    // Mở từ chi tiết thủ tục: /booking?category=HO_TICH → chọn sẵn lĩnh vực
    useEffect(() => {
        const code = searchParams.get("category");

        if (preselectApplied.current || !code || !categories.data) {
            return;
        }

        preselectApplied.current = true;
        const match = categories.data.find(item => item.code === code);

        if (match) {
            setCategory(match);
            setStep(2);
        }
    }, [categories.data, searchParams]);

    useEffect(() => {
        pageRef.current?.scrollTo({ top: 0 });
    }, [step, result]);

    const errors = useMemo(() => validateContact(form), [form]);
    const duplicate = useMemo(
        () =>
            step === 4 && category
                ? findPendingToday(normalizePhone(form.phone), category.code)
                : undefined,
        [step, category, form.phone],
    );

    const handleBack = () => {
        if (result || step === 1) {
            navigate(-1);
            return;
        }

        setSubmitError(undefined);
        setStep((step - 1) as Step);
    };

    const handleSelectCategory = (next: BookingCategory) => {
        if (next.id !== category?.id) {
            setSlot(undefined);
        }

        setCategory(next);
        setStep(2);
    };

    const handleSelectSlot = useCallback((next: BookingSlot | undefined) => {
        setSlot(next);
    }, []);

    const handleChange = (field: keyof ContactForm, value: string) => {
        setForm(current => ({ ...current, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!category || !slot || submittingRef.current) {
            return;
        }

        const citizenName = normalizeName(form.citizenName);
        const phone = normalizePhone(form.phone);
        const citizenId = form.citizenId.trim();

        submittingRef.current = true;
        setSubmitting(true);
        setSubmitError(undefined);

        try {
            const created = await createAppointment({
                slotId: slot.id,
                citizenName,
                phone,
                citizenId: citizenId || undefined,
            });

            upsertSavedAppointments([toSavedAppointment(created, phone)]);
            saveContact({ citizenName, phone });
            setResult(created);
        } catch (error) {
            const message = bookingErrorMessage(error, "create");

            if (isSlotTakenError(error) || isSlotGoneError(error)) {
                // Khung vừa hết chỗ / sang ngày mới: chọn lại khung giờ
                openSnackbar({
                    text: message,
                    type: "warning",
                    duration: 3500,
                });
                setSlot(undefined);
                setSlotReloadKey(value => value + 1);
                setStep(2);
            } else {
                setSubmitError(message);
            }
        } finally {
            submittingRef.current = false;
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        if (step === 2 && slot) {
            setStep(3);
            return;
        }

        if (step === 3) {
            if (Object.keys(errors).length > 0) {
                setShowAllErrors(true);
                return;
            }

            setForm(current => ({
                ...current,
                citizenName: normalizeName(current.citizenName),
                phone: normalizePhone(current.phone),
            }));
            setStep(4);
            return;
        }

        if (step === 4) {
            handleSubmit();
        }
    };

    if (result) {
        return (
            <PageLayout
                className="bg-gray-50"
                name="booking"
                ref={pageRef}
                title={PAGE_TITLE}
            >
                <BookingSuccess appointment={result} category={category} />
            </PageLayout>
        );
    }

    const primaryLabel = step === 4 ? "Xác nhận đặt lịch" : "Tiếp tục";
    const primaryDisabled =
        submitting ||
        (step === 2 && !slot) ||
        (step === 4 && (!category || !slot));

    return (
        <PageLayout
            className="bg-gray-50"
            name="booking"
            ref={pageRef}
            title={PAGE_TITLE}
            onBackClick={handleBack}
        >
            <main
                className="px-4 pt-4"
                style={{
                    paddingBottom:
                        step > 1
                            ? "calc(6rem + var(--zaui-safe-area-inset-bottom, 0px))"
                            : "2rem",
                }}
            >
                <Stepper step={step} />

                <div className="mb-3 mt-4 flex items-end justify-between gap-3">
                    <h2 className="m-0 text-base font-bold leading-6 text-gray-900">
                        {STEP_DESCRIPTIONS[step]}
                    </h2>
                    {step === 2 && category && (
                        <button
                            className="shrink-0 border-0 bg-transparent p-0 text-xs font-semibold text-blue-600 active:opacity-70"
                            type="button"
                            onClick={() => setStep(1)}
                        >
                            Đổi lĩnh vực
                        </button>
                    )}
                </div>

                {step === 1 && todayPendingCount > 0 && (
                    <button
                        className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-left active:bg-emerald-100"
                        type="button"
                        onClick={() => navigate("/appointments")}
                    >
                        <CalendarCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                        <span className="min-w-0 flex-1 text-sm font-semibold text-emerald-800">
                            Bạn có {todayPendingCount} lịch hẹn hôm nay
                        </span>
                        <span className="flex shrink-0 items-center text-xs font-semibold text-emerald-700">
                            Xem
                            <ChevronRight className="h-4 w-4" />
                        </span>
                    </button>
                )}

                {step === 1 && (
                    <>
                        <CategoryStep
                            categories={categories.data}
                            error={categories.error}
                            loading={categories.loading}
                            selectedId={category?.id}
                            onRetry={categories.retry}
                            onSelect={handleSelectCategory}
                        />
                        <button
                            className="mx-auto mt-5 flex items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold text-blue-600 active:opacity-70"
                            type="button"
                            onClick={() => navigate("/appointments")}
                        >
                            <CalendarCheck className="h-4 w-4" />
                            Lịch hẹn của tôi
                        </button>
                    </>
                )}

                {step === 2 && category && (
                    <>
                        <div className="mb-3 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
                            {category.name}
                        </div>
                        <SlotStep
                            category={category}
                            reloadKey={slotReloadKey}
                            selectedSlotId={slot?.id}
                            onSelect={handleSelectSlot}
                        />
                    </>
                )}

                {step === 3 && (
                    <ContactStep
                        errors={errors}
                        form={form}
                        showAllErrors={showAllErrors}
                        onChange={handleChange}
                    />
                )}

                {step === 4 && category && slot && (
                    <ConfirmStep
                        category={category}
                        contact={form}
                        duplicate={duplicate}
                        slot={slot}
                        submitError={submitError}
                    />
                )}
            </main>

            {step > 1 && (
                <div
                    className="fixed inset-x-0 bottom-0 z-10 flex gap-3 border-t border-gray-200 bg-white px-4 pt-3"
                    style={{
                        paddingBottom:
                            "calc(0.75rem + var(--zaui-safe-area-inset-bottom, 0px))",
                    }}
                >
                    <button
                        className="h-12 rounded-xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 active:bg-gray-50 disabled:opacity-50"
                        disabled={submitting}
                        type="button"
                        onClick={handleBack}
                    >
                        Quay lại
                    </button>
                    <button
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-0 bg-blue-600 px-4 text-sm font-bold text-white active:bg-blue-700 disabled:bg-gray-300"
                        disabled={primaryDisabled}
                        type="button"
                        onClick={handleNext}
                    >
                        {submitting && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}
                        {submitting ? "Đang đặt lịch…" : primaryLabel}
                    </button>
                </div>
            )}
        </PageLayout>
    );
};

export default BookingPage;

export { BookingPage };
