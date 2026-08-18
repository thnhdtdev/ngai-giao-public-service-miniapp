import { Utinity } from "@dts";
import { BookOpen, CalendarDays, Globe2, PenLine, Search } from "lucide-react";

export const APP_UTINITIES: Array<Utinity> = [
    {
        key: "create-schedule-appointment",
        label: "Đặt lịch làm việc",
        icon: CalendarDays,
        path: "/create-schedule-appointment",
    },
    {
        key: "info",
        label: "Thông tin - hướng dẫn",
        icon: BookOpen,
        path: "/information-guide",
    },
    {
        key: "feedback",
        label: "Góp ý - phản ánh",
        icon: PenLine,
        path: "/feedbacks",
    },
    {
        key: "goverment",
        label: "Cổng dịch vụ công quốc gia",
        icon: Globe2,
        link: "https://dichvucong.gov.vn/",
    },
    {
        key: "file-search",
        label: "Tra cứu hồ sơ",
        icon: Search,
        path: "/search",
    },
];
