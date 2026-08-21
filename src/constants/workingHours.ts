// src/constants/workingHours.ts

export const WORKING_HOURS = [
    {
        id: "weekday-morning",
        days: "Thứ Hai - Thứ Sáu",
        period: "Buổi sáng",
        time: "07:30 - 11:30",
        isClosed: false,
    },
    {
        id: "weekday-afternoon",
        days: "Thứ Hai - Thứ Sáu",
        period: "Buổi chiều",
        time: "13:30 - 17:00",
        isClosed: false,
    },
    {
        id: "saturday-morning",
        days: "Thứ Bảy",
        period: "Buổi sáng",
        time: "07:30 - 11:30",
        isClosed: false,
    },
    {
        id: "saturday-afternoon",
        days: "Thứ Bảy",
        period: "Buổi chiều",
        time: "Nghỉ",
        isClosed: true,
    },
    {
        id: "sunday",
        days: "Chủ nhật",
        period: "Lịch làm việc",
        time: "Nghỉ",
        isClosed: true,
    },
];