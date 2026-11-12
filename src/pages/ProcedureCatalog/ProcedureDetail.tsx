import {
    Banknote,
    Building2,
    ChevronDown,
    ClipboardList,
    Clock3,
    ExternalLink,
    FileCheck2,
    Info,
    ListOrdered,
    LoaderCircle,
    RotateCw,
    Scale,
    Send,
    TriangleAlert,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

import { buildProcedureDetailView } from "@api/procedureDetailView";
import { useProcedureDetail } from "@api/procedures";
import PageLayout from "@components/layout/PageLayout";

const PAGE_TITLE = "Chi tiết thủ tục";

const DetailSection: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}> = ({ icon, title, children }) => (
    <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="m-0 flex items-center gap-2 text-base font-bold text-gray-900">
            <span className="text-blue-600">{icon}</span>
            {title}
        </h3>

        <div className="mt-3 text-sm leading-6 text-gray-700">{children}</div>
    </section>
);

const Fact: React.FC<{
    icon: React.ReactNode;
    label: string;
    values: string[];
}> = ({ icon, label, values }) => (
    <div className="rounded-xl bg-gray-50 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            {icon}
            {label}
        </div>

        <div className="mt-1 text-sm font-bold leading-5 text-gray-900">
            {values.length ? values.join(" · ") : "Không có thông tin"}
        </div>
    </div>
);

const ProcedureDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const { procedureId } = useParams<{ procedureId: string }>();
    const { data, error, loading, retry } = useProcedureDetail(procedureId);
    const [showLegalBases, setShowLegalBases] = useState(false);

    const view = useMemo(
        () => (data ? buildProcedureDetailView(data) : undefined),
        [data],
    );

    const submitUrl = data?.submitUrl ?? data?.sourceUrl;

    const handleSubmitOnline = async () => {
        if (!submitUrl) {
            return;
        }

        try {
            await openWebview({ url: submitUrl, config: { style: "normal" } });
        } catch {
            openSnackbar({
                text: "Không thể mở Cổng Dịch vụ công. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    if (loading) {
        return (
            <PageLayout className="bg-gray-50" title={PAGE_TITLE}>
                <div className="flex min-h-64 items-center justify-center text-blue-600">
                    <LoaderCircle className="h-7 w-7 animate-spin" />
                </div>
            </PageLayout>
        );
    }

    if (error || !data || !view) {
        return (
            <PageLayout className="bg-gray-50" title={PAGE_TITLE}>
                <div className="flex min-h-96 items-center justify-center px-6 text-center">
                    <div>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <TriangleAlert className="h-7 w-7" />
                        </div>

                        <h2 className="mt-4 text-base font-bold text-gray-900">
                            {error ?? "Không tải được thủ tục"}
                        </h2>

                        <div className="mt-4 flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 active:bg-gray-50"
                            >
                                Quay lại
                            </button>

                            <button
                                type="button"
                                onClick={retry}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white active:bg-blue-700"
                            >
                                <RotateCw className="h-4 w-4" />
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const showGroupNames = view.dossier.length > 1;

    return (
        <PageLayout
            className="bg-gray-50"
            name="procedure-detail"
            title={PAGE_TITLE}
        >
            <main className="px-4 pb-8 pt-4">
                {/* Thông tin chung */}
                <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    {data.field && (
                        <div className="mb-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            {data.field}
                        </div>
                    )}

                    <h2 className="m-0 text-base font-bold leading-6 text-gray-900">
                        {data.title}
                    </h2>

                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                        {data.procedureCode && (
                            <div>
                                Mã thủ tục:{" "}
                                <span className="font-semibold text-gray-700">
                                    {data.procedureCode}
                                </span>
                            </div>
                        )}

                        {data.agency && (
                            <div className="flex items-start gap-1">
                                <Building2 className="mt-px h-3.5 w-3.5 shrink-0" />
                                <span>{data.agency}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2">
                        <Fact
                            icon={<Clock3 className="h-3.5 w-3.5" />}
                            label="Thời hạn giải quyết"
                            values={view.durations}
                        />
                        <Fact
                            icon={<Banknote className="h-3.5 w-3.5" />}
                            label="Phí, lệ phí"
                            values={view.fees}
                        />
                        <Fact
                            icon={<Send className="h-3.5 w-3.5" />}
                            label="Cách thức nộp"
                            values={view.channels}
                        />
                    </div>

                    {submitUrl && (
                        <button
                            type="button"
                            onClick={() => handleSubmitOnline()}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-blue-600 px-4 py-3 text-sm font-bold text-white active:bg-blue-700"
                        >
                            Nộp trực tuyến trên Cổng DVC
                            <ExternalLink className="h-4 w-4" />
                        </button>
                    )}
                </section>

                {view.dossier.length > 0 && (
                    <DetailSection
                        icon={<ClipboardList className="h-5 w-5" />}
                        title="Thành phần hồ sơ"
                    >
                        <div className="space-y-4">
                            {view.dossier.map((group, groupIndex) => (
                                // Tên nhóm có thể trùng nên ghép thêm vị trí
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={`${group.name}-${groupIndex}`}>
                                    {showGroupNames && group.name && (
                                        <div className="mb-2 text-sm font-semibold text-gray-900">
                                            {group.name}
                                        </div>
                                    )}

                                    <ul className="m-0 list-none space-y-2 p-0">
                                        {group.items.map((item, itemIndex) => (
                                            <li
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={`${item.name}-${itemIndex}`}
                                                className="rounded-xl bg-gray-50 p-3"
                                            >
                                                <div className="whitespace-pre-line">
                                                    {item.name}
                                                </div>

                                                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                                                    {item.required && (
                                                        <span className="font-semibold text-red-600">
                                                            Bắt buộc
                                                        </span>
                                                    )}
                                                    {item.originalQty !==
                                                        null &&
                                                        item.originalQty >
                                                            0 && (
                                                            <span>
                                                                Bản chính:{" "}
                                                                {
                                                                    item.originalQty
                                                                }
                                                            </span>
                                                        )}
                                                    {item.copyQty !== null &&
                                                        item.copyQty > 0 && (
                                                            <span>
                                                                Bản sao:{" "}
                                                                {item.copyQty}
                                                            </span>
                                                        )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </DetailSection>
                )}

                {view.steps.length > 0 && (
                    <DetailSection
                        icon={<ListOrdered className="h-5 w-5" />}
                        title="Trình tự thực hiện"
                    >
                        <div className="space-y-3">
                            {view.steps.map((step, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={index}>
                                    {step.name && (
                                        <div className="font-semibold text-gray-900">
                                            {step.name}
                                        </div>
                                    )}
                                    <div className="whitespace-pre-line">
                                        {step.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DetailSection>
                )}

                {view.methods.length > 0 && (
                    <DetailSection
                        icon={<Send className="h-5 w-5" />}
                        title="Cách thức thực hiện"
                    >
                        <div className="space-y-3">
                            {view.methods.map((method, index) => (
                                <div
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`${method.channel}-${index}`}
                                    className="rounded-xl bg-gray-50 p-3"
                                >
                                    <div className="font-semibold text-gray-900">
                                        {method.channel}
                                    </div>

                                    {(method.duration ||
                                        method.fees.length > 0) && (
                                        <div className="mt-1 text-xs text-gray-500">
                                            {[method.duration, ...method.fees]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </div>
                                    )}

                                    {method.description && (
                                        <div className="mt-2 whitespace-pre-line">
                                            {method.description}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {view.feeNotes.map(note => (
                                <p
                                    key={note}
                                    className="m-0 whitespace-pre-line text-xs leading-5 text-gray-500"
                                >
                                    {note}
                                </p>
                            ))}
                        </div>
                    </DetailSection>
                )}

                {view.requirements && (
                    <DetailSection
                        icon={<Info className="h-5 w-5" />}
                        title="Yêu cầu, điều kiện"
                    >
                        <div className="whitespace-pre-line">
                            {view.requirements}
                        </div>
                    </DetailSection>
                )}

                {view.results.length > 0 && (
                    <DetailSection
                        icon={<FileCheck2 className="h-5 w-5" />}
                        title="Kết quả thực hiện"
                    >
                        <ul className="m-0 list-disc space-y-1 pl-5">
                            {view.results.map(result => (
                                <li key={result}>{result}</li>
                            ))}
                        </ul>
                    </DetailSection>
                )}

                {view.legalBases.length > 0 && (
                    <section className="mt-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={() => setShowLegalBases(value => !value)}
                            aria-expanded={showLegalBases}
                            className="flex w-full items-center gap-2 p-4 text-left"
                        >
                            <Scale className="h-5 w-5 text-blue-600" />
                            <span className="flex-1 text-base font-bold text-gray-900">
                                Căn cứ pháp lý ({view.legalBases.length})
                            </span>
                            <ChevronDown
                                className={`h-5 w-5 text-gray-400 transition-transform ${
                                    showLegalBases ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {showLegalBases && (
                            <ul className="m-0 list-none space-y-2 px-4 pb-4 text-sm leading-5 text-gray-700">
                                {view.legalBases.map((basis, index) => (
                                    <li
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={`${basis.code}-${index}`}
                                        className="rounded-xl bg-gray-50 p-3"
                                    >
                                        {basis.code && (
                                            <div className="text-xs font-semibold text-blue-700">
                                                {basis.code}
                                            </div>
                                        )}
                                        {basis.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}

                {view.note && (
                    <DetailSection
                        icon={<Info className="h-5 w-5" />}
                        title="Lưu ý"
                    >
                        <div className="whitespace-pre-line">{view.note}</div>
                    </DetailSection>
                )}
            </main>
        </PageLayout>
    );
};

export default ProcedureDetailPage;

export { ProcedureDetailPage };
