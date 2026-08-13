import {
    Globe2,
    Clock3,
    CircleHelp,
    CirclePlay,
    Star,
    MessageCircle,
    FileText,
    ClipboardList,
    MapPin,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { openChat, openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

type UtilityItemBase = {
    id: string;
    title: string;
    icon: React.ReactNode;
    theme: string;
};

type UtilityItem =
    | (UtilityItemBase & { type: "route"; path: string })
    | (UtilityItemBase & { type: "external"; url: string })
    | (UtilityItemBase & { type: "coming-soon" })
    | (UtilityItemBase & {
          type: "oa";
          oaId: string;
          message?: string;
      });

const utilities: UtilityItem[] = [
    {
        id: "online-service",
        type: "external",
        title: "Nộp hồ sơ trực tuyến",
        icon: <Globe2 className="h-7 w-7" />,
        url: "https://dichvucong.gov.vn/",
        theme: "bg-blue-50 text-blue-600",
    },
    {
        id: "online-guide",
        type: "route",
        title: "Hướng dẫn nộp online",
        icon: <FileText className="h-7 w-7" />,
        path: "/online-guide",
        theme: "bg-violet-50 text-violet-600",
    },
    {
        id: "common-procedures",
        type: "route",
        title: "Thủ tục thường dùng",
        icon: <ClipboardList className="h-7 w-7" />,
        path: "/common-procedures",
        theme: "bg-orange-50 text-orange-600",
    },
    {
        id: "working-hours",
        type: "route",
        title: "Giờ làm việc",
        icon: <Clock3 className="h-7 w-7" />,
        path: "/working-hours",
        theme: "bg-cyan-50 text-cyan-600",
    },
    {
        id: "contact",
        type: "oa",
        title: "Liên hệ",
        icon: <MessageCircle className="h-7 w-7" />,
        oaId: "2261565257434514638",
        message: "Xin chào, tôi cần hỗ trợ về thủ tục hành chính.",
        theme: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "faq",
        type: "route",
        title: "Trợ lý hỏi đáp",
        icon: <CircleHelp className="h-7 w-7" />,
        path: "/qa",
        theme: "bg-sky-50 text-sky-600",
    },
    {
        id: "videos",
        type: "coming-soon",
        title: "Video hướng dẫn",
        icon: <CirclePlay className="h-7 w-7" />,
        theme: "bg-pink-50 text-pink-600",
    },
    {
        id: "location",
        type: "route",
        title: "Địa chỉ & Chỉ đường",
        icon: <MapPin className="h-7 w-7" />,
        path: "/location",
        theme: "bg-violet-50 text-violet-600",
    },
];

const MainUtilities: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    const handleUtility = async (item: UtilityItem) => {
        if (item.type === "route") {
            navigate(item.path);
            return;
        }

        if (item.type === "oa") {
            try {
                await openChat({
                    type: "oa",
                    id: item.oaId,
                    message: item.message,
                });
            } catch {
                openSnackbar({
                    text: "Không thể mở chat Zalo OA",
                    type: "error",
                });
            }

            return;
        }

        if (item.type === "external") {
            try {
                await openWebview({
                    url: item.url,
                    config: {
                        style: "normal",
                    },
                });
            } catch {
                openSnackbar({
                    text: "Không thể mở liên kết",
                    type: "error",
                });
            }

            return;
        }

        openSnackbar({
            text: `Chức năng "${item.title}" đang được hoàn thiện`,
            type: "info",
        });
    };

    return (
        <section className="px-4 pb-6 pt-2">
            <div className="mb-4 flex items-center gap-2">
                <Star className="h-6 w-6 text-blue-600" />
                <h2 className="m-0 text-xl font-bold leading-7 text-gray-800">
                    Tiện ích chính
                </h2>
            </div>

            <div className="grid grid-cols-4 gap-x-2.5 gap-y-5">
                {utilities.map(item => (
                    <button
                        className="group m-0 flex min-w-0 flex-col items-center border-0 bg-transparent p-0 active:opacity-75"
                        key={item.id}
                        type="button"
                        onClick={() => handleUtility(item)}
                    >
                        <span
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 shadow-sm transition-transform group-active:scale-95 ${item.theme}`}
                        >
                            {item.icon}
                        </span>
                        <span className="mt-2 w-full break-words text-center text-xs font-semibold leading-4 text-gray-700">
                            {item.title}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default MainUtilities;
