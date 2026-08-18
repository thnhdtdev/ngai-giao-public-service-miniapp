import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

import {
    ChevronRight,
    ExternalLink,
    FileText,
    Landmark,
    MapPinned,
    Megaphone,
} from "lucide-react";

import {
    PUBLIC_NOTICE_CATEGORIES,
    PublicNotice,
    PublicNoticeCategory,
} from "@constants/publicNotices";
import PageLayout from "@components/layout/PageLayout";

const formatTitle = (title: string) => {
    const normalizedTitle = title.trim().toLocaleLowerCase("vi-VN");

    if (!normalizedTitle) {
        return "";
    }

    return `${normalizedTitle[0].toLocaleUpperCase(
        "vi-VN",
    )}${normalizedTitle.slice(1)}`;
};

const PublicNoticesPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const [selectedCategory, setSelectedCategory] =
        useState<PublicNoticeCategory | null>(null);

    const handleBack = () => {
        if (selectedCategory) {
            setSelectedCategory(null);
            return;
        }

        navigate(-1);
    };

    const handleOpenNotice = async (notice: PublicNotice) => {
        if (!notice.url) {
            openSnackbar({
                text: "Liên kết văn bản đang được cập nhật",
                type: "info",
                duration: 2500,
            });

            return;
        }

        try {
            await openWebview({
                url: notice.url,
                config: {
                    style: "normal",
                },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở văn bản. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    return (
        <PageLayout
            className="bg-gray-50"
            name="public-notices"
            title={
                selectedCategory ? selectedCategory.title : "Niêm yết công khai"
            }
            onBackClick={handleBack}
        >
            <main className="px-4 pb-8 pt-4">
                {!selectedCategory ? (
                    <>
                        {/* Hero */}
                        <section className="rounded-3xl bg-gradient-to-br from-cyan-600 to-teal-600 p-5 text-white shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                                <Megaphone className="h-6 w-6" />
                            </div>

                            <h2 className="mt-4 text-xl font-bold leading-7">
                                Niêm yết công khai
                            </h2>

                            <p className="mt-2 text-sm leading-5 text-white/90">
                                Tra cứu các văn bản, quyết định và thông tin
                                được công khai tại xã Ngãi Giao.
                            </p>
                        </section>

                        <div className="mb-3 mt-6">
                            <h2 className="m-0 text-base font-bold text-gray-900">
                                Chọn nội dung
                            </h2>

                            <p className="mb-0 mt-1 text-sm text-gray-500">
                                Chọn nhóm để xem danh sách văn bản
                            </p>
                        </div>

                        {/* 2 cột */}
                        <section className="grid grid-cols-2 gap-3">
                            {PUBLIC_NOTICE_CATEGORIES.map(category => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className="flex min-h-48 flex-col rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm active:bg-gray-50"
                                >
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                            category.id === "non-boundary"
                                                ? "bg-orange-50 text-orange-600"
                                                : "bg-blue-50 text-blue-600"
                                        }`}
                                    >
                                        {category.id === "non-boundary" ? (
                                            <MapPinned className="h-6 w-6" />
                                        ) : (
                                            <Landmark className="h-6 w-6" />
                                        )}
                                    </div>

                                    <h3 className="mb-0 mt-4 text-base font-bold leading-5 text-gray-900">
                                        {category.title}
                                    </h3>

                                    <p className="mb-0 mt-2 flex-1 text-xs leading-4 text-gray-500">
                                        {category.description}
                                    </p>

                                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600">
                                        Xem danh sách
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </button>
                            ))}
                        </section>
                    </>
                ) : (
                    <>
                        {/* Category */}
                        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    {selectedCategory.id === "non-boundary" ? (
                                        <MapPinned className="h-6 w-6" />
                                    ) : (
                                        <Landmark className="h-6 w-6" />
                                    )}
                                </div>

                                <div>
                                    <h2 className="m-0 text-base font-bold text-gray-900">
                                        {selectedCategory.title}
                                    </h2>

                                    <p className="mb-0 mt-1 text-xs leading-4 text-gray-500">
                                        {selectedCategory.notices.length} văn
                                        bản
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="mb-3 mt-6">
                            <h2 className="m-0 text-base font-bold text-gray-900">
                                Danh sách niêm yết
                            </h2>
                        </div>

                        {/* List */}
                        <section className="space-y-3">
                            {selectedCategory.notices.map((notice, index) => (
                                <button
                                    key={notice.id}
                                    type="button"
                                    onClick={() => handleOpenNotice(notice)}
                                    className="flex w-full items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm active:bg-gray-50"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                        <FileText className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 text-xs font-semibold text-gray-400">
                                            Văn bản {index + 1}
                                        </div>

                                        <div className="text-sm font-bold leading-5 text-gray-900">
                                            {formatTitle(notice.title)}
                                        </div>

                                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-600">
                                            Xem tài liệu
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </div>
                                    </div>

                                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-300" />
                                </button>
                            ))}
                        </section>
                    </>
                )}
            </main>
        </PageLayout>
    );
};

export default PublicNoticesPage;

export { PublicNoticesPage };
