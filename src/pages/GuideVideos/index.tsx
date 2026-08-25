import PageLayout from "@components/layout/PageLayout";
import {
    GUIDE_VIDEOS,
    GuideVideo,
} from "@constants/guideVideos";
import {
    CirclePlay,
    Play,
    X,
} from "lucide-react";
import React, { useState } from "react";

export const GuideVideosPage: React.FC = () => {
    const [selectedVideo, setSelectedVideo] =
        useState<GuideVideo | null>(null);

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
                                onClick={() =>
                                    setSelectedVideo(null)
                                }
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 active:bg-slate-200"
                                aria-label="Đóng video"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

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
                        Các video hướng dẫn người dân thực hiện
                        thủ tục hành chính và dịch vụ công.
                    </div>
                </div>

                <div className="space-y-3">
                    {GUIDE_VIDEOS.map(video => {
                        const isSelected =
                            selectedVideo?.id === video.id;

                        return (
                            <button
                                key={video.id}
                                type="button"
                                onClick={() =>
                                    setSelectedVideo(video)
                                }
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
                        );
                    })}
                </div>
            </div>
        </PageLayout>
    );
};

export default GuideVideosPage;