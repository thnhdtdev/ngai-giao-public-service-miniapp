import {
    FileText,
    Globe2,
    Landmark,
    MessageCircle,
    Search,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

type ActionItem = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    theme: string;
} & (
    | { type: "route"; path: string }
    | { type: "external"; url: string }
    | { type: "coming-soon" }
);

const actions: ActionItem[] = [
    {
        id: "lookup-dossier",
        type: "external",
        icon: <Search className="h-6 w-6" />,
        title: "Tra cứu hồ sơ",
        description: "Kiểm tra trạng thái hồ sơ",
        url: "https://dichvucong.gov.vn/tra-cuu-ho-so",
        theme: "from-blue-500 to-blue-600",
    },
    {
        id: "common-procedures",
        type: "route",
        icon: <FileText className="h-6 w-6" />,
        title: "Thủ tục thường dùng",
        description: "Các thủ tục hành chính thường xuyên thực hiện",
        path: "/common-procedures",
        theme: "from-violet-500 to-violet-600",
    },
    {
        id: "online-guide",
        type: "route",
        icon: <Globe2 className="h-6 w-6" />,
        title: "Hướng dẫn nộp online",
        description: "Hướng dẫn các bước nộp hồ sơ trực tuyến",
        path: "/online-guide",
        theme: "from-green-500 to-green-600",
    },
    {
        id: "feedback",
        type: "external",
        icon: <MessageCircle className="h-6 w-6" />,
        title: "Phản ánh, kiến nghị",
        description: "Gửi phản ánh trên Cổng DVCQG",
        url: "https://dichvucong.gov.vn/nop-phan-anh-kien-nghi",
        theme: "from-orange-500 to-red-500",
    },
];

const QuickActions: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const handleAction = async (action: ActionItem) => {
        if (action.type === "route") {
            navigate(action.path);
            return;
        }

        if (action.type === "external") {
            await openWebview({
                url: action.url,
                config: {
                    style: "normal",
                },
            });
            return;
        }

        openSnackbar({
            text: "Tính năng đang được phát triển",
            type: "info",
        });
    };

    return (
        <section className="px-4 py-5">
            <div className="mb-4 flex items-center gap-2">
                <Landmark className="h-6 w-6 text-blue-600" />
                <h2 className="m-0 text-xl font-bold leading-7 text-gray-800">
                    Dịch vụ công
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {actions.map(action => (
                    <button
                        className={`relative flex min-h-32 flex-col overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br p-4 text-left text-white shadow-lg transition-transform active:scale-95 ${action.theme}`}
                        key={action.id}
                        type="button"
                        onClick={() => handleAction(action)}
                    >
                        <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
                        <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 backdrop-blur-sm">
                            {action.icon}
                        </span>
                        <span className="relative z-10 mt-3 text-base font-bold leading-5">
                            {action.title}
                        </span>
                        <span className="relative z-10 mt-1 text-xs leading-4 text-white/80">
                            {action.description}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default QuickActions;
