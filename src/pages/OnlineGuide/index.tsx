import PageLayout from "@components/layout/PageLayout";
import React from "react";
import { openWebview } from "zmp-sdk";
import {
    Search,
    Building2,
    LogIn,
    FileText,
    Paperclip,
    Send,
    CircleCheck,
    ExternalLink,
    Info,
    FileCheck2,
} from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Tìm thủ tục cần thực hiện",
        description:
            "Tra cứu tên thủ tục hành chính hoặc dịch vụ công mà bạn cần thực hiện.",
        icon: <Search className="h-5 w-5" />,
        theme: "bg-blue-50 text-blue-600",
    },
    {
        number: "02",
        title: "Chọn cơ quan thực hiện",
        description:
            "Kiểm tra đúng cơ quan có thẩm quyền giải quyết thủ tục trước khi nộp hồ sơ.",
        icon: <Building2 className="h-5 w-5" />,
        theme: "bg-violet-50 text-violet-600",
    },
    {
        number: "03",
        title: "Đăng nhập tài khoản",
        description:
            "Công dân đăng nhập Cổng Dịch vụ công bằng tài khoản định danh điện tử VNeID.",
        icon: <LogIn className="h-5 w-5" />,
        theme: "bg-cyan-50 text-cyan-600",
    },
    {
        number: "04",
        title: "Kê khai thông tin",
        description:
            "Điền đầy đủ và chính xác các thông tin theo biểu mẫu điện tử của thủ tục.",
        icon: <FileText className="h-5 w-5" />,
        theme: "bg-emerald-50 text-emerald-600",
    },
    {
        number: "05",
        title: "Đính kèm giấy tờ",
        description:
            "Tải lên bản điện tử các giấy tờ được yêu cầu nếu thủ tục có yêu cầu thành phần hồ sơ.",
        icon: <Paperclip className="h-5 w-5" />,
        theme: "bg-orange-50 text-orange-600",
    },
    {
        number: "06",
        title: "Kiểm tra và nộp hồ sơ",
        description:
            "Kiểm tra lại nội dung đã kê khai, thực hiện thanh toán phí hoặc lệ phí nếu có, sau đó gửi hồ sơ.",
        icon: <Send className="h-5 w-5" />,
        theme: "bg-pink-50 text-pink-600",
    },
    {
        number: "07",
        title: "Theo dõi kết quả",
        description:
            "Lưu mã hồ sơ để tra cứu và theo dõi trạng thái xử lý sau khi nộp.",
        icon: <CircleCheck className="h-5 w-5" />,
        theme: "bg-green-50 text-green-600",
    },
];

const OnlineGuidePage: React.FC = () => {
    const handleOpenPortal = async () => {
        try {
            await openWebview({
                url: "https://dichvucong.gov.vn/p/home/dvc-dich-vu-cong-truc-tuyen.html",
                config: {
                    style: "normal",
                },
            });
        } catch (error) {
            console.error("Không thể mở Cổng Dịch vụ công:", error);
        }
    };

    return (
        <PageLayout
            className="bg-gray-50"
            name="online-guide"
            title="Hướng dẫn nộp hồ sơ online"
        >
            <main className="px-4 pb-8 pt-4">
                {/* Hero */}
                <section className="rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 p-5 text-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                        <FileCheck2 className="h-6 w-6" />
                    </div>

                    <h2 className="mt-4 text-xl font-bold leading-7">
                        Nộp hồ sơ trực tuyến
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-white/90">
                        Hướng dẫn các bước cơ bản để người dân thực hiện thủ tục
                        hành chính trực tuyến.
                    </p>
                </section>

                {/* Notice */}
                <section className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <p className="m-0 text-sm leading-5 text-gray-700">
                        Quy trình chi tiết có thể khác nhau tùy từng thủ tục.
                        Hãy đọc kỹ thành phần hồ sơ và yêu cầu trên Cổng Dịch vụ
                        công trước khi gửi.
                    </p>
                </section>

                <h2 className="mb-3 mt-6 text-base font-bold text-gray-900">
                    Các bước thực hiện
                </h2>

                {/* Steps */}
                <section className="space-y-3">
                    {steps.map(step => (
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
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="text-xs font-bold text-blue-600">
                                            BƯỚC {step.number}
                                        </span>
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

                {/* CTA */}
                <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
                    <h3 className="m-0 text-base font-bold text-gray-900">
                        Sẵn sàng nộp hồ sơ?
                    </h3>

                    <p className="mb-4 mt-1 text-sm leading-5 text-gray-500">
                        Truy cập Cổng Dịch vụ công Quốc gia để lựa chọn thủ tục
                        và bắt đầu kê khai.
                    </p>

                    <button
                        type="button"
                        onClick={() => handleOpenPortal()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-blue-600 px-4 py-3 text-sm font-bold text-white active:bg-blue-700"
                    >
                        Nộp hồ sơ trực tuyến
                        <ExternalLink className="h-4 w-4" />
                    </button>
                </section>
            </main>
        </PageLayout>
    );
};

export default OnlineGuidePage;

export { OnlineGuidePage };
