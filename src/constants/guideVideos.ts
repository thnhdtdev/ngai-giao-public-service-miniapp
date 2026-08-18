import Banner1 from "@assets/banner-1.png";

export type GuideVideo = {
    id: string;
    title: string;
    description: string;
    duration?: string;
    thumbnail?: string;
    url: string;
};

export const GUIDE_VIDEOS: GuideVideo[] = [
    {
        id: "common-procedures",
        title: "Những thủ tục thường gặp",
        description:
            "Hướng dẫn tra cứu và thực hiện các thủ tục hành chính thường xuyên phát sinh.",
        duration: "",
        thumbnail: Banner1,
        url: "https://youtu.be/blNf1OH5JMA",
    },
    {
        id: "certification",
        title: "Hướng dẫn thủ tục chứng thực",
        description:
            "Hướng dẫn thực hiện các thủ tục chứng thực bản sao và chứng thực chữ ký.",
        duration: "",
        thumbnail: "",
        url: "",
    },
    {
        id: "linked-birth-registration",
        title: "Hướng dẫn liên thông khai sinh",
        description:
            "Hướng dẫn thực hiện thủ tục đăng ký khai sinh liên thông và các bước liên quan.",
        duration: "",
        thumbnail: "",
        url: "",
    },
    {
        id: "business-registration",
        title: "Hướng dẫn đăng ký kinh doanh",
        description:
            "Hướng dẫn các bước thực hiện thủ tục đăng ký kinh doanh trực tuyến.",
        duration: "",
        thumbnail: "",
        url: "",
    },
];
