const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;

export const getPublicNoticeById = (
    noticeId: string,
): PublicNotice | undefined => {
    for (const category of PUBLIC_NOTICE_CATEGORIES) {
        const notice = category.notices.find(
            item => item.id === noticeId,
        );

        if (notice) {
            return notice;
        }
    }

    return undefined;
};

export const getPublicNoticeCategoryByNoticeId = (
    noticeId: string,
): PublicNoticeCategory | undefined => {
    return PUBLIC_NOTICE_CATEGORIES.find(category =>
        category.notices.some(
            notice => notice.id === noticeId,
        ),
    );
};

export type PublicNotice = {
    id: string;
    title: string;
    url: string;
};

export type PublicNoticeCategory = {
    id: "non-boundary" | "ngai-giao";
    title: string;
    description: string;
    notices: PublicNotice[];
};

export const PUBLIC_NOTICE_CATEGORIES: PublicNoticeCategory[] = [
    {
        id: "non-boundary",
        title: "TTHC phi địa giới",
        description:
            "Các thủ tục hành chính thực hiện không phụ thuộc địa giới hành chính",
        notices: [
            {
                id: "non-boundary-01",
                title: "Thủ tục hành chính thuộc thẩm quyền quản lý và giải quyết của Sở, ban, ngành, Ủy ban nhân dân cấp xã thực hiện không phụ thuộc vào địa giới hành chính",
                url: `${MEDIA_BASE_URL}/documents/phi-dia-gioi/PL_danh_muc_PDG.pdf`,
            },
            {
                id: "non-boundary-02",
                title: "Về việc phê duyệt quy trình nội bộ, quy trình điện tử giải quyết thủ tục hành chính không phụ thuộc vào địa giới hành chính thuộc phạm vi chức năng quản lý của Sở Tư pháp",
                url: `${MEDIA_BASE_URL}/documents/phi-dia-gioi/QD3424.pdf`,
            },
            {
                id: "non-boundary-03",
                title: "Ban hành Quy trình thí điểm tiếp nhận, luân chuyển hồ sơ và trả kết quả giải quyết thủ tục hành chính (bản giấy) không phụ thuộc địa giới hành chính tại Thành phố Hồ Chí Minh",
                url: `${MEDIA_BASE_URL}/documents/phi-dia-gioi/QD3516.pdf`,
            },
            {
                id: "non-boundary-04",
                title: "Về việc phê duyệt quy trình nội bộ, quy trình điện tử giải quyết thủ tục hành chính không phụ thuộc vào địa giới hành chính thuộc phạm vi chức năng quản lý của Sở Công Thương",
                url: `${MEDIA_BASE_URL}/documents/phi-dia-gioi/QD3544_QTNB_SCT.pdf`,
            },
            {
                id: "non-boundary-05",
                title: "PHÊ DUYỆT QUY TRÌNH NỘI BỘ, QUY TRÌNH ĐIỆN TỬ GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH KHÔNG PHỤ THUỘC VÀO ĐỊA GIỚI HÀNH CHÍNH LĨNH VỰC NGƯỜI CÓ CÔNG; LAO ĐỘNG – TIỀN LƯƠNG; CHÍNH SÁCH THUỘC PHẠM VI CHỨC NĂNG QUẢN LÝ CỦA SỞ NỘI VỤ",
                url: `${MEDIA_BASE_URL}/documents/phi-dia-gioi/QD3493.pdf`,
            },
            {
                id: "non-boundary-06",
                title: "Về việc phê duyệt quy trình nội bộ, quy trình điện tử giải quyết thủ tục hành chính không phụ thuộc vào địa giới hành chính thuộc phạm vi chức năng quản lý của Sở Du lịch",
                url: `${MEDIA_BASE_URL}/documents/phi-dia-gioi/QD3630_QTNB_SDL.pdf`,
            },
            {
                id: "non-boundary-07",
                title: "Về việc phê duyệt quy trình nội bộ, quy trình điện tử giải quyết thủ tục hành chính không phụ thuộc vào địa giới hành chính lĩnh vực Người có công; Lao động – Tiền lương; Chính sách thuộc phạm vi chức năng quản lý của Sở Nội vụ",
                url: `${MEDIA_BASE_URL}/documents/phi-dia-gioi/QD74.pdf`,
            },
            {
                id: "non-boundary-08",
                title: "Phê duyệt Danh mục thủ tục hành chính thuộc thẩm quyền quản lý và giải quyết của sở, ban, ngành, Ủy ban nhân dân cấp xã thực hiện không phụ thuộc vào địa giới hành chính trên địa bàn Thành phố Hồ Chí Minh",
                url: `${MEDIA_BASE_URL}/documents/phi-dia-gioi/QD_cong_bo_TTHC_PDGHC.pdf`,
            },
        ],
    },

    {
        id: "ngai-giao",
        title: "TTHC xã Ngãi Giao",
        description:
            "Các văn bản và thủ tục hành chính được niêm yết công khai tại xã Ngãi Giao",
        notices: [
            {
                id: "ngai-giao-01",
                title: "Nghị quyết quy định mức thu lệ phí đối với hoạt động cung cấp dịch vụ công bằng hình thức trực tuyến",
                url: `${MEDIA_BASE_URL}/documents/ngai-giao/PL_danh_muc_PDG_signed.pdf`,
            },
            {
                id: "ngai-giao-02",
                title: " Công bố danh mục thủ tục hành chính (TTHC) thuộc thẩm quyền tiếp nhận hoặc giải quyết của các cấp chính quyền trên địa bàn Thành phố.",
                url: `${MEDIA_BASE_URL}/documents/ngai-giao/QD_signed.pdf`,
            },
            {
                id: "ngai-giao-03",
                title: "Danh mục các thủ tục hành chính thuộc thẩm quyền quản lý và giải quyết của Sở, ban, ngành và Ủy ban nhân dân cấp xã tại Thành phố Hồ Chí Minh",
                url: "",
            }
        ],
    },
];
