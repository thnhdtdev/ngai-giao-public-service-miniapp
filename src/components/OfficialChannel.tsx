import { useSnackbar } from "zmp-ui";
import React, { useEffect, useState } from "react";
import { followOA, getUserInfo, openChat, openWebview } from "zmp-sdk";
import {
    Bell,
    CalendarDays,
    Check,
    ExternalLink,
    MessageCircle,
    Star,
} from "lucide-react";

import logoHcc from "@assets/logo-hcc.png";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";

const { organization, zalo, social } = NGAI_GIAO_ORGANIZATION;

const OfficialChannels: React.FC = () => {
    const { openSnackbar } = useSnackbar();

    const [followed, setFollowed] = useState(false);
    const [checking, setChecking] = useState(true);
    const [following, setFollowing] = useState(false);

    const checkFollowStatus = async () => {
        try {
            const { userInfo } = await getUserInfo();

            setFollowed(Boolean(userInfo?.followedOA));
        } catch {
            setFollowed(false);
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        checkFollowStatus();
    }, []);

    const handleFollowOA = async () => {
        if (followed || following) {
            return;
        }

        try {
            setFollowing(true);

            await followOA({
                id: zalo.oaId,
            });

            setFollowed(true);

            openSnackbar({
                text: "Cảm ơn bạn đã quan tâm kênh chính thức",
                type: "success",
                duration: 2500,
            });
        } catch (error) {
            const appError = error as {
                code?: number;
            };

            // -201: người dùng chủ động từ chối theo dõi
            if (appError?.code === -201) {
                return;
            }

            openSnackbar({
                text: "Không thể quan tâm OA. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        } finally {
            setFollowing(false);
        }
    };

    const handleOpenChat = async () => {
        try {
            await openChat({
                type: "oa",
                id: zalo.oaId,
                message: zalo.defaultSupportMessage,
            });
        } catch {
            openSnackbar({
                text: "Không thể mở kênh hỗ trợ.",
                type: "error",
                duration: 3000,
            });
        }
    };

    const handleOpenFacebook = async () => {
        try {
            await openWebview({
                url: social.facebook.url,
                config: {
                    style: "normal",
                    leftButton: "back",
                },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở trang Facebook.",
                type: "error",
                duration: 3000,
            });
        }
    };

    let followButtonText = "Quan tâm";

    if (checking) {
        followButtonText = "...";
    } else if (following) {
        followButtonText = "Đang xử lý...";
    } else if (followed) {
        followButtonText = "Đã quan tâm";
    }

    return (
        <section className="px-4 pb-6">
            <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
                    <div className="flex items-center gap-2">
                        <Star className="h-6 w-6" />

                        <h2 className="m-0 text-xl font-bold">
                            Kênh chính thức
                        </h2>
                    </div>

                    <p className="mb-0 mt-1 text-sm leading-5 text-blue-50">
                        Theo dõi các kênh để nhận thông báo và cập nhật mới nhất
                        từ Trung tâm
                    </p>
                </div>

                {/* OA information */}
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white">
                            <img
                                src={logoHcc}
                                alt={`Logo ${organization.fullName}`}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="m-0 text-base font-bold leading-5 text-gray-900">
                                {organization.name}
                            </h3>

                            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600">
                                <Check className="h-4 w-4" />
                                Kênh chính thức
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={checking || following || followed}
                            onClick={() => handleFollowOA()}
                            className={`shrink-0 whitespace-nowrap rounded-full border-0 px-3 py-2 text-xs font-bold ${
                                followed
                                    ? "bg-gray-100 text-gray-500"
                                    : "bg-blue-50 text-blue-600 active:bg-blue-100"
                            }`}
                        >
                            {followButtonText}
                        </button>
                    </div>

                    {/* Official channel actions */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleOpenChat()}
                            className="flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 text-sm font-bold text-blue-600 active:bg-blue-100"
                        >
                            <MessageCircle className="h-5 w-5 shrink-0" />
                            <span>Nhắn tin Zalo</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleOpenFacebook()}
                            className="flex items-center justify-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-3 text-sm font-bold text-sky-700 active:bg-sky-100"
                        >
                            <ExternalLink className="h-5 w-5 shrink-0" />
                            <span>Xem {social.facebook.label}</span>
                        </button>
                    </div>

                    {/* Benefits */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-blue-50 p-4 text-center">
                            <Bell className="mx-auto h-6 w-6 text-blue-600" />

                            <div className="mt-2 text-sm font-bold text-blue-700">
                                Thông báo nhanh
                            </div>

                            <div className="mt-1 text-xs leading-4 text-gray-500">
                                Nhận thông tin cần thiết
                            </div>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                            <CalendarDays className="mx-auto h-6 w-6 text-emerald-600" />

                            <div className="mt-2 text-sm font-bold text-emerald-700">
                                Cập nhật thường xuyên
                            </div>

                            <div className="mt-1 text-xs leading-4 text-gray-500">
                                Theo dõi thông tin mới
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OfficialChannels;
