import React from "react";
import { openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";
import { Building2, MapPin, Navigation, Copy, Info } from "lucide-react";

import PageLayout from "@components/layout/PageLayout";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";

const CENTER_NAME = NGAI_GIAO_ORGANIZATION.organization.fullName;
const CENTER_ADDRESS = NGAI_GIAO_ORGANIZATION.organization.address.display;
const MAP_URL = NGAI_GIAO_ORGANIZATION.organization.address.mapUrl;

const LocationPage: React.FC = () => {
    const { openSnackbar } = useSnackbar();

    const handleDirections = async () => {
        try {
            await openWebview({
                url: MAP_URL,
                config: {
                    style: "normal",
                },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở bản đồ. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(CENTER_ADDRESS);

            openSnackbar({
                text: "Đã sao chép địa chỉ",
                type: "success",
                duration: 2000,
            });
        } catch {
            openSnackbar({
                text: "Không thể sao chép địa chỉ",
                type: "error",
                duration: 2500,
            });
        }
    };

    return (
        <PageLayout
            className="bg-gray-50"
            name="location"
            title="Địa chỉ & Chỉ đường"
        >
            <main className="px-4 pb-8 pt-4">
                {/* Hero */}
                <section className="rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 p-5 text-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                        <MapPin className="h-6 w-6" />
                    </div>

                    <h2 className="mt-4 text-xl font-bold leading-7">
                        Tìm đường đến Trung tâm
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-white/90">
                        Xem địa chỉ và mở bản đồ để được hướng dẫn đường đi.
                    </p>
                </section>

                {/* Center */}
                <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Building2 className="h-6 w-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="text-base font-bold leading-6 text-gray-900">
                                {CENTER_NAME}
                            </div>

                            <div className="mt-3 flex items-start gap-2 text-sm leading-5 text-gray-600">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                                <span>{CENTER_ADDRESS}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleCopyAddress()}
                            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold text-gray-700 active:bg-gray-50"
                        >
                            <Copy className="h-4 w-4" />
                            Sao chép
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDirections()}
                            className="flex items-center justify-center gap-2 rounded-xl border-0 bg-blue-600 px-3 py-3 text-sm font-bold text-white active:bg-blue-700"
                        >
                            <Navigation className="h-4 w-4" />
                            Chỉ đường
                        </button>
                    </div>
                </section>

                {/* Notice */}
                <section className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <p className="m-0 text-sm leading-5 text-gray-700">
                        Nhấn <strong>Chỉ đường</strong> để mở bản đồ và tìm
                        tuyến đường từ vị trí hiện tại của bạn đến Trung tâm.
                    </p>
                </section>
            </main>
        </PageLayout>
    );
};

export default LocationPage;

export { LocationPage };
