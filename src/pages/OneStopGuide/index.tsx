import React from "react";
import { useNavigate } from "react-router-dom";
import { openChat } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";
import {
    BadgeCheck,
    Building2,
    Check,
    ChevronRight,
    CircleAlert,
    CircleCheck,
    ClipboardCheck,
    Clock3,
    FileCheck2,
    Files,
    IdCard,
    Info,
    Landmark,
    MapPin,
    MessageCircle,
    ReceiptText,
    Search,
    ShieldCheck,
} from "lucide-react";

import PageLayout from "@components/layout/PageLayout";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";

const preparationItems = [
    {
        id: "procedure",
        title: "Xác định đúng thủ tục",
        description:
            "Tra cứu tên thủ tục và cơ quan có thẩm quyền tiếp nhận trước khi đến.",
        icon: <Search className="h-5 w-5" />,
        theme: "bg-blue-50 text-blue-600",
    },
    {
        id: "documents",
        title: "Chuẩn bị giấy tờ",
        description:
            "Kiểm tra thành phần, số lượng hồ sơ và mang bản chính để đối chiếu nếu được yêu cầu.",
        icon: <Files className="h-5 w-5" />,
        theme: "bg-violet-50 text-violet-600",
    },
    {
        id: "identity",
        title: "Mang giấy tờ định danh",
        description:
            "Chuẩn bị CCCD hoặc tài khoản VNeID và thông tin liên hệ đang sử dụng.",
        icon: <IdCard className="h-5 w-5" />,
        theme: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "schedule",
        title: "Kiểm tra thời gian, địa điểm",
        description:
            "Xem giờ làm việc và địa chỉ Trung tâm để chủ động sắp xếp thời gian.",
        icon: <Clock3 className="h-5 w-5" />,
        theme: "bg-orange-50 text-orange-600",
    },
];

const processSteps = [
    {
        number: "01",
        title: "Đến Trung tâm",
        description:
            "Đến Trung tâm trong giờ làm việc và chuẩn bị sẵn giấy tờ cần thiết.",
        icon: <Building2 className="h-5 w-5" />,
        theme: "bg-blue-50 text-blue-600",
    },
    {
        number: "02",
        title: "Liên hệ quầy hướng dẫn",
        description:
            "Trình bày thủ tục cần thực hiện để được hướng dẫn đến đúng quầy tiếp nhận và lấy số thứ tự nếu có.",
        icon: <Landmark className="h-5 w-5" />,
        theme: "bg-violet-50 text-violet-600",
    },
    {
        number: "03",
        title: "Nộp hồ sơ",
        description:
            "Xuất trình giấy tờ và nộp các thành phần hồ sơ theo yêu cầu của thủ tục.",
        icon: <ClipboardCheck className="h-5 w-5" />,
        theme: "bg-cyan-50 text-cyan-600",
    },
    {
        number: "04",
        title: "Kiểm tra hồ sơ",
        description:
            "Cán bộ tiếp nhận kiểm tra hồ sơ và hướng dẫn điều chỉnh hoặc bổ sung khi cần.",
        icon: <FileCheck2 className="h-5 w-5" />,
        theme: "bg-amber-50 text-amber-600",
    },
    {
        number: "05",
        title: "Nhận giấy tiếp nhận",
        description:
            "Khi hồ sơ đủ điều kiện tiếp nhận, lưu lại mã hồ sơ và thông tin hẹn trả kết quả.",
        icon: <ReceiptText className="h-5 w-5" />,
        theme: "bg-pink-50 text-pink-600",
    },
    {
        number: "06",
        title: "Theo dõi và nhận kết quả",
        description:
            "Theo dõi tiến độ bằng mã hồ sơ và nhận kết quả theo hình thức đã đăng ký.",
        icon: <BadgeCheck className="h-5 w-5" />,
        theme: "bg-green-50 text-green-600",
    },
];

const dossierStatuses = [
    {
        id: "received",
        title: "Đã tiếp nhận",
        description: "Hồ sơ đã được ghi nhận.",
        theme: "border-blue-100 bg-blue-50 text-blue-700",
    },
    {
        id: "processing",
        title: "Đang xử lý",
        description: "Hồ sơ đang được giải quyết.",
        theme: "border-violet-100 bg-violet-50 text-violet-700",
    },
    {
        id: "additional",
        title: "Cần bổ sung",
        description: "Hồ sơ cần điều chỉnh hoặc bổ sung.",
        theme: "border-amber-100 bg-amber-50 text-amber-700",
    },
    {
        id: "completed",
        title: "Đã có kết quả",
        description: "Kết quả đã sẵn sàng để nhận.",
        theme: "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
];

const importantNotes = [
    "Kiểm tra kỹ thông tin cá nhân trước khi ký xác nhận.",
    "Giữ lại giấy tiếp nhận, giấy hẹn và mã hồ sơ để tra cứu.",
    "Chỉ thực hiện phí, lệ phí theo thông báo chính thức của cơ quan tiếp nhận.",
    "Không chia sẻ mã hồ sơ hoặc thông tin cá nhân cho người không liên quan.",
];

const OneStopGuidePage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const handleOpenSupport = async () => {
        try {
            await openChat({
                type: "oa",
                id: NGAI_GIAO_ORGANIZATION.zalo.oaId,
                message: NGAI_GIAO_ORGANIZATION.zalo.defaultSupportMessage,
            });
        } catch {
            openSnackbar({
                text: "Không thể mở kênh hỗ trợ. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    return (
        <PageLayout
            className="bg-gray-50"
            name="one-stop-guide"
            title="Hướng dẫn một cửa"
        >
            <main className="px-4 pb-8 pt-4">
                <section className="rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 p-5 text-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                        <Landmark className="h-6 w-6" />
                    </div>

                    <h2 className="mt-4 text-xl font-bold leading-7">
                        Thực hiện thủ tục tại Bộ phận Một cửa
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-white/90">
                        Chuẩn bị đúng giấy tờ, nộp hồ sơ và nhận kết quả thuận
                        tiện tại {NGAI_GIAO_ORGANIZATION.organization.fullName}.
                    </p>
                </section>

                <section className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <p className="m-0 text-sm leading-5 text-gray-700">
                        Đây là quy trình tham khảo. Thành phần hồ sơ, phí, lệ
                        phí và cách nhận kết quả có thể khác nhau tùy từng thủ
                        tục.
                    </p>
                </section>

                <div className="mb-3 mt-6">
                    <h2 className="m-0 text-base font-bold text-gray-900">
                        Chuẩn bị trước khi đến
                    </h2>
                    <p className="mb-0 mt-1 text-sm text-gray-500">
                        Kiểm tra trước để hạn chế việc phải bổ sung hồ sơ
                    </p>
                </div>

                <section className="space-y-3">
                    {preparationItems.map(item => (
                        <div
                            key={item.id}
                            className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                        >
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.theme}`}
                            >
                                {item.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="m-0 text-sm font-bold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="mb-0 mt-1 text-sm leading-5 text-gray-500">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>

                <div className="mb-3 mt-6">
                    <h2 className="m-0 text-base font-bold text-gray-900">
                        Quy trình thực hiện
                    </h2>
                    <p className="mb-0 mt-1 text-sm text-gray-500">
                        Các bước cơ bản khi làm thủ tục trực tiếp
                    </p>
                </div>

                <section className="space-y-3">
                    {processSteps.map(step => (
                        <div
                            key={step.number}
                            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step.theme}`}
                                >
                                    {step.icon}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 text-xs font-bold text-blue-600">
                                        BƯỚC {step.number}
                                    </div>
                                    <h3 className="m-0 text-sm font-bold text-gray-900">
                                        {step.title}
                                    </h3>
                                    <p className="mb-0 mt-1 text-sm leading-5 text-gray-500">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        <div>
                            <h2 className="m-0 text-sm font-bold text-amber-900">
                                Khi hồ sơ cần bổ sung
                            </h2>
                            <p className="mb-0 mt-1 text-sm leading-5 text-amber-800">
                                Ghi lại chính xác giấy tờ hoặc thông tin cần bổ
                                sung và hoàn thiện theo hướng dẫn trước khi nộp
                                lại.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mb-3 mt-6">
                    <h2 className="m-0 text-base font-bold text-gray-900">
                        Trạng thái hồ sơ thường gặp
                    </h2>
                </div>

                <section className="grid grid-cols-2 gap-3">
                    {dossierStatuses.map(status => (
                        <div
                            key={status.id}
                            className={`rounded-2xl border p-3 ${status.theme}`}
                        >
                            <CircleCheck className="h-5 w-5" />
                            <h3 className="mb-0 mt-2 text-sm font-bold">
                                {status.title}
                            </h3>
                            <p className="mb-0 mt-1 text-xs leading-4 text-gray-600">
                                {status.description}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <h2 className="m-0 text-base font-bold text-gray-900">
                            Lưu ý quan trọng
                        </h2>
                    </div>

                    <div className="mt-3 space-y-3">
                        {importantNotes.map(note => (
                            <div
                                key={note}
                                className="flex items-start gap-2 text-sm leading-5 text-gray-600"
                            >
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                <span>{note}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="mb-3 mt-6">
                    <h2 className="m-0 text-base font-bold text-gray-900">
                        Hỗ trợ nhanh
                    </h2>
                </div>

                <section className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/common-procedures")}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3 text-left text-sm font-bold text-gray-700 active:bg-gray-50"
                    >
                        <span>Thủ tục thường dùng</span>
                        <ChevronRight className="h-4 w-4 shrink-0" />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/working-hours")}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3 text-left text-sm font-bold text-gray-700 active:bg-gray-50"
                    >
                        <span>Giờ làm việc</span>
                        <Clock3 className="h-4 w-4 shrink-0 text-cyan-600" />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/location")}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3 text-left text-sm font-bold text-gray-700 active:bg-gray-50"
                    >
                        <span>Địa chỉ Trung tâm</span>
                        <MapPin className="h-4 w-4 shrink-0 text-violet-600" />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleOpenSupport()}
                        className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 text-left text-sm font-bold text-blue-700 active:bg-blue-100"
                    >
                        <span>Nhắn tin Zalo</span>
                        <MessageCircle className="h-4 w-4 shrink-0" />
                    </button>
                </section>
            </main>
        </PageLayout>
    );
};

export default OneStopGuidePage;

export { OneStopGuidePage };
