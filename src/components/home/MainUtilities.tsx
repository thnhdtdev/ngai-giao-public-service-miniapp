import {
    CalendarDays,
    CircleHelp,
    CirclePlay,
    Clock3,
    ContactRound,
    FileDown,
    Globe2,
    Star,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { openWebview } from "zmp-sdk";
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
    | (UtilityItemBase & { type: "coming-soon" });

const utilities: UtilityItem[] = [
    {
        id: "online-service",
        type: "external",
        title: "Nộp hồ sơ trực tuyến",
        icon: <Globe2 className="h-7 w-7" />,
        url: "https://dichvucong.gov.vn/p/home/dvc-dich-vu-cong-truc-tuyen-ds.html",
        theme: "bg-blue-50 text-blue-600",
    },
    {
        id: "forms",
        type: "coming-soon",
        title: "Biểu mẫu TTHC",
        icon: <FileDown className="h-7 w-7" />,
        theme: "bg-violet-50 text-violet-600",
    },
    {
        id: "citizen-reception",
        type: "coming-soon",
        title: "Lịch tiếp công dân",
        icon: <CalendarDays className="h-7 w-7" />,
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
        id: "departments",
        type: "coming-soon",
        title: "Danh bạ bộ phận",
        icon: <ContactRound className="h-7 w-7" />,
        theme: "bg-green-50 text-green-600",
    },
    {
        id: "faq",
        type: "coming-soon",
        title: "Câu hỏi thường gặp",
        icon: <CircleHelp className="h-7 w-7" />,
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
        id: "rating",
        type: "coming-soon",
        title: "Đánh giá hài lòng",
        icon: <Star className="h-7 w-7" />,
        theme: "bg-amber-50 text-amber-600",
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

        if (item.type === "external") {
            try {
                await openWebview({ url: item.url });
            } catch (error) {
                console.error("Không thể mở liên kết:", error);
            }

            return;
        }

        openSnackbar({
            text: "Tính năng đang được phát triển",
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
