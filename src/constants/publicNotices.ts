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
                title: "Phê duyệt danh mục thủ tục hành chính thuộc thẩm quyền quản lý và giải quyết thực hiện không phụ thuộc vào địa giới hành chính",
                url: "https://drive.google.com/file/d/1lyZRwvUYf-jsh4p3aYNPqVCjZ8vE5wFs/view",
            },
            {
                id: "non-boundary-02",
                title: "THỦ TỤC HÀNH CHÍNH THUỘC THẨM QUYỀN QUẢN LÝ VÀ GIẢI QUYẾT CỦA SỞ, BAN, NGÀNH, ỦY BAN NHÂN DÂN CẤP XÃ THỰC HIỆN KHÔNG PHỤ THUỘC VÀO ĐỊA GIỚI HÀNH CHÍNH",
                url: "https://drive.google.com/file/d/1WxESBMWbTDK-L3yxW74i8T7jjLMXK4Dc/view",
            },
            {
                id: "non-boundary-03",
                title: "Tiếp nhận, luân chuyển hồ sơ và trả kết quả giải quyết thủ tục hành chính (bản giấy) không phụ thuộc địa giới hành chính tại Thành phố Hồ Chí Minh",
                url: "https://drive.google.com/file/d/1sqEL3iWLjCQcCJeaohg-zP6HJ_JatDSc/view",
            },
            {
                id: "non-boundary-04",
                title: "BAN HÀNH QUY TRÌNH THÍ ĐIỂM TIẾP NHẬN, LUÂN CHUYỂN HỒ SƠ VÀ TRẢ KẾT QUẢ GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH (BẢN GIẤY) KHÔNG PHỤ THUỘC ĐỊA GIỚI HÀNH CHÍNH TẠI THÀNH PHỐ HỒ CHÍ MINH ",
                url: "https://drive.google.com/file/d/1Bsr4WqK_wJKOvBmpNf2F39HRKoAf9_IW/view",
            },
            {
                id: "non-boundary-05",
                title: "PHÊ DUYỆT QUY TRÌNH NỘI BỘ, QUY TRÌNH ĐIỆN TỬ GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH KHÔNG PHỤ THUỘC VÀO ĐỊA GIỚI HÀNH CHÍNH LĨNH VỰC NGƯỜI CÓ CÔNG; LAO ĐỘNG – TIỀN LƯƠNG; CHÍNH SÁCH THUỘC PHẠM VI CHỨC NĂNG QUẢN LÝ CỦA SỞ NỘI VỤ",
                url: "https://drive.google.com/file/d/1A6kdWLMSyKHAk3j8ZJPOYifdPuw2BWoN/view",
            },
            {
                id: "non-boundary-06",
                title: "PHÊ DUYỆT QUY TRÌNH NỘI BỘ, QUY TRÌNH ĐIỆN TỬ GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH KHÔNG PHỤ THUỘC VÀO ĐỊA GIỚI HÀNH CHÍNH THUỘC PHẠM VI CHỨC NĂNG QUẢN LÝ CỦA SỞ DU LỊCH",
                url: "https://drive.google.com/file/d/1N2x8Z47a3jUap0tPyL5qcksfRoLtXb8-/view",
            },
            {
                id: "non-boundary-07",
                title: "PHÊ DUYỆT QUY TRÌNH NỘI BỘ, QUY TRÌNH ĐIỆN TỬ GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH KHÔNG PHỤ THUỘC VÀO ĐỊA GIỚI HÀNH CHÍNH THUỘC PHẠM VI CHỨC NĂNG QUẢN LÝ CỦA SỞ CÔNG THƯƠNG ",
                url: "https://drive.google.com/file/d/1mlY_KFBEozGaY2wzyO3NcVlCBn8L7qX7/view",
            },
            {
                id: "non-boundary-08",
                title: "PHÊ DUYỆT QUY TRÌNH NỘI BỘ, QUY TRÌNH ĐIỆN TỬ GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH KHÔNG PHỤ THUỘC VÀO ĐỊA GIỚI HÀNH CHÍNH LĨNH VỰC THỂ DỤC THỂ THAO THUỘC PHẠM VI CHỨC NĂNG QUẢN LÝ CỦA SỞ VĂN HÓA VÀ THỂ THAO",
                url: "https://drive.google.com/file/d/1QKYkBYCn3yiI5dAHM9u0q96vgkJ4ubre/view",
            },
            {
                id: "non-boundary-09",
                title: "PHÊ DUYỆT QUY TRÌNH NỘI BỘ, QUY TRÌNH ĐIỆN TỬ GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH KHÔNG PHỤ THUỘC VÀO ĐỊA GIỚI HÀNH CHÍNH THUỘC PHẠM VI CHỨC NĂNG QUẢN LÝ CỦA SỞ TƯ PHÁP",
                url: "https://drive.google.com/file/d/15OmNCWXbXiZwqdMOUNGyZWcaKzhwDQwa/view",
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
                url: "",
            },
            {
                id: "ngai-giao-02",
                title: " Công bố danh mục thủ tục hành chính (TTHC) thuộc thẩm quyền tiếp nhận hoặc giải quyết của các cấp chính quyền trên địa bàn Thành phố.",
                url: "https://drive.google.com/file/d/1AsZKrTdLFEoFYp8oz5crvcZAPpzQdEg_/view",
            },
            {
                id: "ngai-giao-03",
                title: "Danh mục các thủ tục hành chính thuộc thẩm quyền quản lý và giải quyết của Sở, ban, ngành và Ủy ban nhân dân cấp xã tại Thành phố Hồ Chí Minh",
                url: "https://drive.google.com/file/d/1JdVgGio63kAT06NtuUEf_g6ZdrBPALx3/view",
            },
            {
                id: "ngai-giao-04",
                title: "Phụ lục danh mục dịch vụ công trực tuyến cấp xã(THEO QĐ 3494)",
                url: "https://docs.google.com/spreadsheets/d/11NWeAPNm_RoMkQhlXYX5wT3pXYnBgXf72tjd6H50M90/edit?gid=0#gid=0",
            },
        ],
    },
];
