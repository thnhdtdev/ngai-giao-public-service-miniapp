import React from "react";
import { useSnackbar } from "zmp-ui";
import { openChat, openWebview } from "zmp-sdk";
import {
    Baby,
    BadgeCheck,
    MapPinned,
    ExternalLink,
    MessageCircle,
    Sparkles,
    ShieldCheck,
} from "lucide-react";

import PageLayout from "@components/layout/PageLayout";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";

type QACategory = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    theme: string;
    notebookUrl?: string;
};

const { oaId } = NGAI_GIAO_ORGANIZATION.zalo;

const categories: QACategory[] = [
    {
        id: "civil-status",
        title: "Hộ tịch",
        description: "Khai sinh, khai tử, kết hôn và các thủ tục hộ tịch khác",
        icon: <Baby className="h-7 w-7" />,
        theme: "bg-blue-50 text-blue-600 border-blue-100",
        notebookUrl: "",
    },
    {
        id: "certification",
        title: "Chứng thực",
        description: "Chứng thực bản sao, chữ ký, hợp đồng và giao dịch",
        icon: <BadgeCheck className="h-7 w-7" />,
        theme: "bg-violet-50 text-violet-600 border-violet-100",
        notebookUrl: "",
    },
    {
        id: "land",
        title: "Đất đai",
        description: "Thông tin hỗ trợ về hồ sơ, thủ tục và lĩnh vực đất đai",
        icon: <MapPinned className="h-7 w-7" />,
        theme: "bg-emerald-50 text-emerald-600 border-emerald-100",
        notebookUrl: "",
    },
];

const QA: React.FC = () => {
    const { openSnackbar } = useSnackbar();

    const handleOpenNotebook = async (category: QACategory) => {
        if (!category.notebookUrl) {
            openSnackbar({
                text: `Nội dung ${category.title} đang được cập nhật`,
                type: "info",
                duration: 2500,
            });
            return;
        }

        try {
            await openWebview({
                url: category.notebookUrl,
                config: {
                    style: "normal",
                },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở trợ lý hỏi đáp. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    const handleContact = async () => {
        try {
            await openChat({
                type: "oa",
                id: oaId,
                message: NGAI_GIAO_ORGANIZATION.zalo.defaultSupportMessage,
            });
        } catch {
            openSnackbar({
                text: "Không thể mở kênh hỗ trợ lúc này.",
                type: "error",
                duration: 3000,
            });
        }
    };

    return (
        <PageLayout className="bg-gray-50" name="qa" title="Hỏi đáp thủ tục">
            <main className="px-4 pb-8 pt-4">
                {/* Intro */}
                <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                        <Sparkles className="h-6 w-6" />
                    </div>

                    <h2 className="mt-4 text-xl font-bold leading-7">
                        Bạn cần hỏi về lĩnh vực nào?
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-blue-50">
                        Chọn lĩnh vực phù hợp để mở trợ lý tra cứu và đặt câu
                        hỏi trực tiếp bằng ngôn ngữ tự nhiên.
                    </p>
                </section>

                {/* Title */}
                <div className="mb-3 mt-6">
                    <h2 className="text-base font-bold text-gray-900">
                        Chọn lĩnh vực
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                        Ví dụ: khai sinh, chứng thực bản sao, thủ tục đất đai...
                    </p>
                </div>

                {/* Categories */}
                <section className="space-y-3">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => handleOpenNotebook(category)}
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

                            <ExternalLink className="h-5 w-5 shrink-0 text-gray-400" />
                        </button>
                    ))}
                </section>

                {/* AI notice */}
                <section className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Lưu ý khi sử dụng
                            </h3>

                            <p className="mt-1 text-sm leading-5 text-gray-600">
                                Nội dung hỏi đáp nhằm hỗ trợ tra cứu từ các tài
                                liệu được cung cấp. Với hồ sơ hoặc trường hợp cụ
                                thể, người dân nên liên hệ Bộ phận Một cửa để
                                được hướng dẫn và xác nhận chính thức.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <MessageCircle className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-gray-900">
                                Bạn vẫn cần hỗ trợ?
                            </div>

                            <div className="mt-0.5 text-xs leading-4 text-gray-500">
                                Trao đổi trực tiếp qua Zalo Official Account
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleContact()}
                        className="mt-4 w-full rounded-xl border-0 bg-blue-600 px-4 py-3 text-sm font-bold text-white active:bg-blue-700"
                    >
                        Liên hệ Bộ phận Một cửa
                    </button>
                </section>
            </main>
        </PageLayout>
    );
};

export default QA;

export { QA as QAPage };
