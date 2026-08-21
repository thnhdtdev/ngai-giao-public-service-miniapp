import PageLayout from "@components/layout/PageLayout";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { openWebview } from "zmp-sdk";
import { Header, Icon, useSnackbar } from "zmp-ui";
import {
    Baby,
    BadgeCheck,
    MapPinned,
    ChevronRight,
    ExternalLink,
    FileText,
    Info,
} from "lucide-react";

type CommonProcedure = {
    id: string;
    title: string;
    description?: string;
    url?: string;
};

type ProcedureCategory = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    theme: string;
    procedures: CommonProcedure[];
};

const categories: ProcedureCategory[] = [
    {
        id: "civil-status",
        title: "Hộ tịch",
        description:
            "Các thủ tục hộ tịch thường xuyên được người dân thực hiện",
        icon: <Baby className="h-7 w-7" />,
        theme: "border-blue-100 bg-blue-50 text-blue-600",
        procedures: [
            {
                id: "marital-status",
                title: "Cấp Giấy xác nhận tình trạng hôn nhân",
                description:
                    "Thực hiện thủ tục cấp Giấy xác nhận tình trạng hôn nhân",
                url: "https://dichvucong.gov.vn/tim-kiem-thu-tuc-hanh-chinh?formalityId=019d2bfd-6eb3-7019-bf3f-fc58c9ee44b9&province=019bad30-cd8e-7296-afa4-708eb56a0f18&ministry=&ward=019bad30-cd8e-7296-afa5-244e16a5d8d3&searchType=PROVINCE&commune=WARD&provinceCode=79&wardCode=26575",
            },
            {
                id: "civil-status-copy",
                title: "Cấp bản sao Trích lục hộ tịch, bản sao Giấy khai sinh",
                description:
                    "Yêu cầu cấp bản sao trích lục hộ tịch hoặc bản sao Giấy khai sinh",
                url: "https://dichvucong.gov.vn/tim-kiem-thu-tuc-hanh-chinh?formalityId=019d2bfd-867c-72db-b6a7-dcbd8c763807&province=019bad30-cd8e-7296-afa4-708eb56a0f18&ministry=&ward=019bad30-cd8e-7296-afa5-244e16a5d8d3&searchType=PROVINCE&commune=WARD&provinceCode=79&wardCode=26575",
            },
            {
                id: "linked-birth-registration",
                title: "Đăng ký khai sinh liên thông",
                description:
                    "Thực hiện thủ tục khai sinh liên thông với các thủ tục liên quan",
                url: "https://lienthong.dichvucong.gov.vn/#/ke-khai/2.000986",
            },
            {
                id: "birth-reregistration",
                title: "Đăng ký lại khai sinh",
                description: "Thực hiện thủ tục đăng ký lại khai sinh",
                url: "https://dichvucong.gov.vn/tim-kiem-thu-tuc-hanh-chinh?formalityId=019d2bfd-6eac-7598-b88b-15f8a61b366a&province=019bad30-cd8e-7296-afa4-708eb56a0f18&ministry=&ward=019bad30-cd8e-7296-afa5-244e16a5d8d3&searchType=PROVINCE&commune=WARD&provinceCode=79&wardCode=26575",
            },
            {
                id: "civil-status-correction",
                title: "Thay đổi, cải chính, bổ sung thông tin hộ tịch, xác định lại dân tộc",
                description:
                    "Thay đổi, cải chính hoặc bổ sung thông tin hộ tịch",
                url: "https://dichvucong.gov.vn/tim-kiem-thu-tuc-hanh-chinh?formalityId=019d2bfd-671e-714b-8fd6-8230c82f7867&province=019bad30-cd8e-7296-afa4-708eb56a0f18&ministry=&ward=019bad30-cd8e-7296-afa5-244e16a5d8d3&searchType=PROVINCE&commune=WARD&provinceCode=79&wardCode=26575",
            },
            {
                id: "death-registration",
                title: "Đăng ký khai tử",
                description: "Thực hiện thủ tục đăng ký khai tử",
                url: "https://dichvucong.gov.vn/tim-kiem-thu-tuc-hanh-chinh?formalityId=019d2bfd-3fac-7489-b53b-9c6c958f2da4&province=019bad30-cd8e-7296-afa4-708eb56a0f18&ministry=&ward=019bad30-cd8e-7296-afa5-244e16a5d8d3&searchType=PROVINCE&commune=WARD&provinceCode=79&wardCode=26575",
            },
            {
                id: "marriage-registration",
                title: "Đăng ký kết hôn",
                description: "Thực hiện thủ tục đăng ký kết hôn",
                url: "https://dichvucong.gov.vn/tim-kiem-thu-tuc-hanh-chinh?formalityId=019d2bfd-3fac-7489-b53b-a15eb239a6fe&province=019bad30-cd8e-7296-afa4-708eb56a0f18&ministry=&ward=019bad30-cd8e-7296-afa5-244e16a5d8d3&searchType=PROVINCE&commune=WARD&provinceCode=79&wardCode=26575",
            },
        ],
    },
    {
        id: "certification",
        title: "Chứng thực",
        description: "Chứng thực bản sao, chữ ký và các thủ tục thường gặp",
        icon: <BadgeCheck className="h-7 w-7" />,
        theme: "border-violet-100 bg-violet-50 text-violet-600",
        procedures: [
            {
                id: "certified-copy",
                title: "Chứng thực bản sao từ bản chính",
                description:
                    "Chứng thực bản sao giấy tờ, văn bản từ bản chính",
                url: "https://dichvucong.gov.vn/tim-kiem-thu-tuc-hanh-chinh?formalityId=019d2bfd-8e22-77ef-819f-e49460350904&province=019bad30-cd8e-7296-afa4-708eb56a0f18&ministry=&ward=019bad30-cd8e-7296-afa5-244e16a5d8d3&searchType=PROVINCE&commune=WARD&provinceCode=79&wardCode=26575",
            },
            {
                id: "signature-certification",
                title: "Chứng thực chữ ký",
                description:
                    "Chứng thực chữ ký, điểm chỉ hoặc trường hợp không thể ký, điểm chỉ",
                url: "https://dichvucong.gov.vn/tim-kiem-thu-tuc-hanh-chinh?formalityId=019d2bfd-8e2e-7359-b42f-d5dc8d74741b&province=019bad30-cd8e-7296-afa4-708eb56a0f18&ministry=&ward=019bad30-cd8e-7296-afa5-244e16a5d8d3&searchType=PROVINCE&commune=WARD&provinceCode=79&wardCode=26575",
            },
        ],
    },
    {
        id: "land",
        title: "Đất đai",
        description: "Các thủ tục thường gặp liên quan đến lĩnh vực đất đai",
        icon: <MapPinned className="h-7 w-7" />,
        theme: "border-emerald-100 bg-emerald-50 text-emerald-600",
        procedures: [],
    },
];

const CommonProceduresPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const [selectedCategory, setSelectedCategory] =
        useState<ProcedureCategory | null>(null);

    const handleBack = () => {
        if (selectedCategory) {
            setSelectedCategory(null);
            return;
        }

        navigate(-1);
    };

    const handleOpenProcedure = async (procedure: CommonProcedure) => {
        if (!procedure.url) {
            openSnackbar({
                text: `Liên kết "${procedure.title}" đang được cập nhật`,
                type: "info",
                duration: 2500,
            });
            return;
        }

        try {
            await openWebview({
                url: procedure.url,
                config: {
                    style: "normal",
                },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở Cổng Dịch vụ công. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    return (
        <PageLayout
            className="bg-gray-50"
            customHeader={
                <Header
                    backIcon={<Icon icon="zi-arrow-left" />}
                    className="app-default-header h-safe-header fixed left-0 top-0 z-10 flex w-full items-center bg-main px-4 text-white"
                    onBackClick={handleBack}
                    showBackIcon
                    title={
                        selectedCategory
                            ? selectedCategory.title
                            : "Thủ tục thường dùng"
                    }
                />
            }
            name="common-procedures"
        >
            <main className="px-4 pb-8 pt-4">
                {!selectedCategory ? (
                    <>
                        {/* Hero */}
                        <section className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                                <FileText className="h-6 w-6" />
                            </div>

                            <h2 className="mt-4 text-xl font-bold leading-7">
                                Bạn muốn thực hiện thủ tục gì?
                            </h2>

                            <p className="mt-2 text-sm leading-5 text-orange-50">
                                Chọn lĩnh vực để xem nhanh các thủ tục hành
                                chính thường xuyên được người dân thực hiện.
                            </p>
                        </section>

                        {/* Category title */}
                        <div className="mb-3 mt-6">
                            <h2 className="m-0 text-base font-bold text-gray-900">
                                Chọn lĩnh vực
                            </h2>

                            <p className="mb-0 mt-1 text-sm leading-5 text-gray-500">
                                Các lĩnh vực phổ biến tại Bộ phận Một cửa
                            </p>
                        </div>

                        {/* Categories */}
                        <section className="space-y-3">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm active:bg-gray-50"
                                >
                                    <span
                                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${category.theme}`}
                                    >
                                        {category.icon}
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-base font-bold text-gray-900">
                                            {category.title}
                                        </span>

                                        <span className="mt-1 block text-sm leading-5 text-gray-500">
                                            {category.description}
                                        </span>
                                    </span>

                                    <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
                                </button>
                            ))}
                        </section>

                        {/* Note */}
                        <section className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                            <p className="m-0 text-sm leading-5 text-gray-700">
                                Khi chọn một thủ tục, Mini App sẽ mở trang tương
                                ứng trên Cổng Dịch vụ công để bạn xem thông tin
                                và thực hiện trực tuyến.
                            </p>
                        </section>
                    </>
                ) : (
                    <>
                        {/* Category introduction */}
                        <section className="rounded-3xl bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${selectedCategory.theme}`}
                                >
                                    {selectedCategory.icon}
                                </div>

                                <div className="min-w-0">
                                    <h2 className="m-0 text-lg font-bold text-gray-900">
                                        {selectedCategory.title}
                                    </h2>

                                    <p className="mb-0 mt-1 text-sm leading-5 text-gray-500">
                                        {selectedCategory.description}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="mb-3 mt-6">
                            <h2 className="m-0 text-base font-bold text-gray-900">
                                Thủ tục thường thực hiện
                            </h2>

                            <p className="mb-0 mt-1 text-sm leading-5 text-gray-500">
                                Chọn thủ tục để xem và thực hiện trên Cổng Dịch
                                vụ công
                            </p>
                        </div>

                        {selectedCategory.procedures.length > 0 ? (
                            <section className="space-y-3">
                                {selectedCategory.procedures.map(procedure => (
                                    <button
                                        key={procedure.id}
                                        type="button"
                                        onClick={() =>
                                            handleOpenProcedure(procedure)
                                        }
                                        className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm active:bg-gray-50"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                            <FileText className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-bold leading-5 text-gray-900">
                                                {procedure.title}
                                            </div>

                                            {procedure.description && (
                                                <div className="mt-1 text-xs leading-4 text-gray-500">
                                                    {procedure.description}
                                                </div>
                                            )}
                                        </div>

                                        <ExternalLink className="h-5 w-5 shrink-0 text-gray-400" />
                                    </button>
                                ))}
                            </section>
                        ) : (
                            <section className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                                    <FileText className="h-6 w-6" />
                                </div>

                                <h3 className="mb-0 mt-3 text-sm font-bold text-gray-900">
                                    Nội dung đang được cập nhật
                                </h3>

                                <p className="mb-0 mt-1 text-sm leading-5 text-gray-500">
                                    Danh sách thủ tục thường dùng của lĩnh vực
                                    này sẽ được bổ sung sau.
                                </p>
                            </section>
                        )}
                    </>
                )}
            </main>
        </PageLayout>
    );
};

export default CommonProceduresPage;

export { CommonProceduresPage };
