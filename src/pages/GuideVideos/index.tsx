import PageLayout from "@components/layout/PageLayout";
import { GUIDE_VIDEOS, GuideVideo } from "@constants/guideVideos";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";
import { CirclePlay, Play, Users, X } from "lucide-react";
import React, { useState } from "react";
import { openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

const { businessGroup } = NGAI_GIAO_ORGANIZATION.zalo;

export const GuideVideosPage: React.FC = () => {
    const { openSnackbar } = useSnackbar();
    const [selectedVideo, setSelectedVideo] = useState<GuideVideo | null>(null);

    const handleOpenBusinessGroup = async () => {
        try {
            await openWebview({
                url: businessGroup.inviteUrl,
                config: {
                    style: "normal",
                    leftButton: "back",
                },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở nhóm Zalo. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    return (
        <PageLayout
            className="bg-slate-50"
            name="guide-videos"
            title="Video hướng dẫn"
        >
            <div className="px-4 pb-7 pt-5">
                {selectedVideo && (
                    <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-start justify-between gap-3 p-4">
                            <div className="min-w-0">
                                <div className="text-base font-bold text-gray-800">
                                    {selectedVideo.title}
                                </div>

                                <div className="mt-1 text-sm leading-5 text-slate-500">
                                    {selectedVideo.description}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedVideo(null)}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 active:bg-slate-200"
                                aria-label="Đóng video"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Video sources currently do not include caption files. */}
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                        <video
                            key={selectedVideo.id}
                            src={selectedVideo.videoUrl}
                            controls
                            playsInline
                            preload="metadata"
                            className="aspect-video w-full bg-black"
                        >
                            Trình duyệt của bạn không hỗ trợ phát video.
                        </video>
                    </div>
                )}

                {/* Header */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                        <CirclePlay className="h-6 w-6 text-pink-600" />
                        Video hướng dẫn
                    </div>

                    <div className="mt-1 text-sm leading-5 text-slate-500">
                        Các video hướng dẫn người dân thực hiện thủ tục hành
                        chính và dịch vụ công.
                    </div>
                </div>

                <div className="space-y-3">
                    {GUIDE_VIDEOS.map(video => {
                        const isSelected = selectedVideo?.id === video.id;

                        return (
                            <React.Fragment key={video.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedVideo(video)}
                                    className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm active:bg-slate-50 ${
                                        isSelected
                                            ? "border-pink-300"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                                        <Play className="h-6 w-6 fill-current" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-bold leading-5 text-gray-800">
                                            {video.title}
                                        </div>

                                        <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                            {video.description}
                                        </div>
                                    </div>
                                </button>

                                {video.id === "business-registration" && (
                                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                <Users className="h-6 w-6" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-bold leading-5 text-blue-800">
                                                    {businessGroup.title}
                                                </div>

                                                <div className="mt-1 text-xs leading-4 text-gray-600">
                                                    {businessGroup.description}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-blue-600 px-3 py-3 text-sm font-bold text-white active:bg-blue-700"
                                            type="button"
                                            onClick={() =>
                                                handleOpenBusinessGroup()
                                            }
                                        >
                                            <Users className="h-5 w-5" />
                                            Tham gia nhóm Zalo
                                        </button>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </PageLayout>
    );
};

export default GuideVideosPage;
