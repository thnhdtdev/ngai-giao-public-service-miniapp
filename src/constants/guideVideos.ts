const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;

export type GuideVideo = {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
};

export const GUIDE_VIDEOS: GuideVideo[] = [
    {
        id: "common-procedures",
        title: "Những thủ tục thường gặp",
        description:
            "Hướng dẫn tra cứu và thực hiện các thủ tục hành chính thường xuyên phát sinh.",
        videoUrl: `${MEDIA_BASE_URL}/videos/doc-than.mp4`
    },
    {
        id: "certification",
        title: "Hướng dẫn thủ tục chứng thực",
        description:
            "Hướng dẫn thực hiện các thủ tục chứng thực bản sao và chứng thực chữ ký.",
        videoUrl: `${MEDIA_BASE_URL}/videos/chung-thuc.mp4`
    },
    {
        id: "linked-birth-registration",
        title: "Hướng dẫn liên thông khai sinh",
        description:
            "Hướng dẫn thực hiện thủ tục đăng ký khai sinh liên thông và các bước liên quan.",
        videoUrl: `${MEDIA_BASE_URL}/videos/khai-sinh-lien-thong.mp4`
    },
    {
        id: "business-registration",
        title: "Hướng dẫn đăng ký kinh doanh",
        description:
            "Hướng dẫn các bước thực hiện thủ tục đăng ký kinh doanh trực tuyến.",
        videoUrl: "",
    },
];
