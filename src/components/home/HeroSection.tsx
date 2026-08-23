import HeroBackground from "@assets/background1.png";
import Logo from "@assets/logo-hcc.png";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";
import { Newspaper, Phone } from "lucide-react";
import React from "react";
import { openPhone, openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

const actionClassName =
    "flex min-h-16 min-w-0 items-center gap-2 rounded-2xl border border-white/50 bg-gradient-to-br from-white/20 to-violet-400/30 p-3 text-left text-white shadow-lg backdrop-blur-md transition-transform active:scale-95";

const actionIconClassName =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md";

const HeroSection: React.FC = () => {
    const { openSnackbar } = useSnackbar();

    const handleOpenFeaturedNews = async () => {
        try {
            await openWebview({
                url: NGAI_GIAO_ORGANIZATION.zalo.profileUrl,
                config: {
                    style: "normal",
                    leftButton: "back",
                },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở tin tức nổi bật. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    const handleCallHotline = async () => {
        const { phoneNumber } = NGAI_GIAO_ORGANIZATION.organization.hotline;

        if (!phoneNumber) {
            return;
        }

        try {
            await openPhone({ phoneNumber });
        } catch {
            openSnackbar({
                text: "Không thể thực hiện cuộc gọi. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    return (
        <section className="relative min-h-72 overflow-hidden px-4 pb-7 pt-20 text-white">
            <img
                className="absolute inset-0 h-full w-full object-cover"
                src={HeroBackground}
                alt=""
                aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 via-blue-900/80 to-blue-600/90" />

            <div className="relative z-10">
                <div className="flex items-center pr-24">
                    <div className="mr-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                        <img
                            className="h-12 w-12 object-contain"
                            src={Logo}
                            alt="Trung tâm Phục vụ Hành chính công Ngãi Giao"
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase leading-4 tracking-wide text-white/90">
                            Trung tâm Phục vụ
                        </div>
                        <div className="mt-0.5 text-base font-bold uppercase leading-5 text-white">
                            Hành chính công
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h1 className="m-0 text-3xl font-bold leading-9 tracking-tight text-white">
                        {NGAI_GIAO_ORGANIZATION.organization.locality}
                    </h1>

                    <p className="mt-2 max-w-xs text-sm leading-5 text-white/90">
                        Đồng hành cùng người dân trong thực hiện thủ tục hành
                        chính nhanh chóng, minh bạch và thuận tiện.
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2.5">
                        <button
                            className={actionClassName}
                            type="button"
                            onClick={() => handleOpenFeaturedNews()}
                        >
                            <span className={actionIconClassName}>
                                <Newspaper className="h-6 w-6" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-sm font-bold leading-5">
                                    Tin tức nổi bật
                                </span>
                                <span className="mt-1 block truncate text-xs leading-4 text-white/80">
                                    Cập nhật mới nhất
                                </span>
                            </span>
                        </button>

                        <button
                            className={actionClassName}
                            type="button"
                            onClick={() => handleCallHotline()}
                        >
                            <span className={actionIconClassName}>
                                <Phone className="h-6 w-6" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-sm font-bold leading-5">
                                    Đường dây nóng
                                </span>
                                <span className="mt-1 block truncate text-xs leading-4 text-white/80">
                                    {
                                        NGAI_GIAO_ORGANIZATION.organization
                                            .hotline.display
                                    }
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
