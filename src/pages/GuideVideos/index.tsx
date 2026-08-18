import React from "react";
import { openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

import { Clock3, ExternalLink, Play, PlayCircle, Video } from "lucide-react";

import { GUIDE_VIDEOS, GuideVideo } from "@constants/guideVideos";
import PageLayout from "@components/layout/PageLayout";

const GuideVideosPage: React.FC = () => {
    const { openSnackbar } = useSnackbar();

    const handleOpenVideo = async (video: GuideVideo) => {
        if (!video.url) {
            openSnackbar({
                text: `Video "${video.title}" đang được cập nhật`,
                type: "info",
                duration: 2500,
            });

            return;
        }

        try {
            await openWebview({
                url: video.url,
                config: {
                    style: "normal",
                },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở video. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    return (
        <PageLayout
            className="bg-gray-50"
            name="guide-videos"
            title="Video hướng dẫn"
        >
            <main className="px-4 pb-8 pt-4">
                {/* Hero */}
                <section className="rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 p-5 text-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                        <Video className="h-6 w-6" />
                    </div>

                    <h2 className="mt-4 text-xl font-bold leading-7">
                        Hướng dẫn bằng video
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-white/90">
                        Xem hướng dẫn từng bước để thực hiện các thao tác thường
                        gặp khi sử dụng dịch vụ công.
                    </p>
                </section>

                {/* Section title */}
                <div className="mb-3 mt-6">
                    <h2 className="m-0 text-base font-bold text-gray-900">
                        Danh sách video
                    </h2>

                    <p className="mb-0 mt-1 text-sm leading-5 text-gray-500">
                        Chọn video để xem hướng dẫn chi tiết
                    </p>
                </div>

                {/* Videos */}
                <section className="space-y-4">
                    {GUIDE_VIDEOS.map((video, index) => (
                        <button
                            key={video.id}
                            type="button"
                            onClick={() => handleOpenVideo(video)}
                            className="block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 text-left shadow-sm active:bg-gray-50"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                {video.thumbnail ? (
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <PlayCircle className="h-14 w-14 text-gray-400" />
                                    </div>
                                )}

                                {/* Play */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white">
                                        <Play
                                            className="ml-1 h-6 w-6"
                                            fill="currentColor"
                                        />
                                    </div>
                                </div>

                                {/* Duration */}
                                {video.duration && (
                                    <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                                        <Clock3 className="h-3 w-3" />
                                        {video.duration}
                                    </span>
                                )}

                                {/* Number */}
                                <span className="absolute left-2 top-2 rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-gray-800">
                                    Video {index + 1}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="m-0 text-base font-bold leading-5 text-gray-900">
                                            {video.title}
                                        </h3>

                                        <p className="mb-0 mt-2 text-sm leading-5 text-gray-500">
                                            {video.description}
                                        </p>
                                    </div>

                                    <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                                </div>

                                <div className="mt-3 flex items-center gap-1.5 text-sm font-bold text-blue-600">
                                    <PlayCircle className="h-4 w-4" />
                                    Xem video hướng dẫn
                                </div>
                            </div>
                        </button>
                    ))}
                </section>

                {/* Footer notice */}
                <section className="mt-5 rounded-2xl bg-blue-50 p-4">
                    <p className="m-0 text-sm leading-5 text-gray-600">
                        Nội dung hướng dẫn được xây dựng nhằm hỗ trợ người dân
                        thao tác thuận tiện hơn khi sử dụng dịch vụ công. Giao
                        diện của các hệ thống có thể được cập nhật theo thời
                        gian.
                    </p>
                </section>
            </main>
        </PageLayout>
    );
};

export default GuideVideosPage;

export { GuideVideosPage };
