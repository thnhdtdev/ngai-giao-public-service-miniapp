import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

import {
    ExternalLink,
    FileText,
    LoaderCircle,
    TriangleAlert,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

import PageLayout from "@components/layout/PageLayout";

import {
    getPublicNoticeById,
    getPublicNoticeCategoryByNoticeId,
} from "@constants/publicNotices";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const isPdfUrl = (url: string) => {
    try {
        return new URL(url).pathname.toLowerCase().endsWith(".pdf");
    } catch {
        return url.toLowerCase().includes(".pdf");
    }
};

const DocumentViewerPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const viewerRef = useRef<HTMLDivElement>(null);

    const [numPages, setNumPages] = useState(0);
    const [viewerWidth, setViewerWidth] = useState(0);
    const [loadError, setLoadError] = useState(false);

    const { noticeId } = useParams<{
        noticeId: string;
    }>();

    const notice = noticeId ? getPublicNoticeById(noticeId) : undefined;

    const category = noticeId
        ? getPublicNoticeCategoryByNoticeId(noticeId)
        : undefined;

    useEffect(() => {
        const viewer = viewerRef.current;

        if (!viewer) {
            return undefined;
        }

        const updateViewerWidth = () => {
            setViewerWidth(Math.floor(viewer.getBoundingClientRect().width));
        };

        updateViewerWidth();
        window.addEventListener("resize", updateViewerWidth);

        let resizeObserver: ResizeObserver | undefined;

        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(updateViewerWidth);
            resizeObserver.observe(viewer);
        }

        return () => {
            window.removeEventListener("resize", updateViewerWidth);
            resizeObserver?.disconnect();
        };
    }, [notice?.url]);

    useEffect(() => {
        setNumPages(0);
        setLoadError(false);
    }, [notice?.url]);

    const handleOpenOriginal = async () => {
        if (!notice?.url) {
            return;
        }

        try {
            await openWebview({
                url: notice.url,
                config: {
                    style: "normal",
                },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở tài liệu",
                type: "error",
            });
        }
    };

    if (!notice) {
        return (
            <PageLayout
                className="bg-gray-50"
                name="document-viewer"
                title="Xem văn bản"
                onBackClick={() => navigate(-1)}
            >
                <div className="flex min-h-96 items-center justify-center px-6 text-center">
                    <div>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                            <FileText className="h-7 w-7" />
                        </div>

                        <h2 className="mt-4 text-base font-bold text-gray-900">
                            Không tìm thấy văn bản
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Văn bản có thể đã được cập nhật.
                        </p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const loadingContent = (
        <div className="flex min-h-64 items-center justify-center text-blue-600">
            <LoaderCircle className="h-7 w-7 animate-spin" />
        </div>
    );

    const errorContent = (
        <div className="flex min-h-96 items-center justify-center px-6 text-center">
            <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <TriangleAlert className="h-7 w-7" />
                </div>

                <h2 className="mt-4 text-base font-bold text-gray-900">
                    Không thể hiển thị văn bản
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Vui lòng thử lại hoặc mở tài liệu gốc.
                </p>

                {notice.url && (
                    <button
                        className="mx-auto mt-4 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white active:bg-blue-700"
                        type="button"
                        onClick={handleOpenOriginal}
                    >
                        <ExternalLink className="h-4 w-4" />
                        Mở tài liệu gốc
                    </button>
                )}
            </div>
        </div>
    );

    let viewerContent: React.ReactNode;

    if (!notice.url) {
        viewerContent = errorContent;
    } else if (isPdfUrl(notice.url)) {
        viewerContent = (
            <div className="w-full overflow-x-hidden bg-gray-200 p-2">
                <div className="w-full" ref={viewerRef}>
                    <Document
                        error={errorContent}
                        file={notice.url}
                        loading={loadingContent}
                        onLoadError={() => setLoadError(true)}
                        onLoadSuccess={({ numPages: totalPages }) => {
                            setNumPages(totalPages);
                            setLoadError(false);
                        }}
                    >
                        {!loadError &&
                            viewerWidth > 0 &&
                            Array.from({ length: numPages }, (_, pageIndex) => {
                                const pageNumber = pageIndex + 1;

                                return (
                                    <section
                                        className="mb-3 overflow-hidden rounded-lg bg-white shadow-sm last:mb-0"
                                        key={pageNumber}
                                    >
                                        <div className="border-b border-gray-100 px-3 py-2 text-center text-xs font-medium text-gray-500">
                                            Trang {pageNumber} / {numPages}
                                        </div>

                                        <Page
                                            loading={loadingContent}
                                            pageNumber={pageNumber}
                                            renderAnnotationLayer={false}
                                            renderTextLayer={false}
                                            width={viewerWidth}
                                        />
                                    </section>
                                );
                            })}
                    </Document>
                </div>
            </div>
        );
    } else {
        viewerContent = (
            <iframe
                className="h-screen w-full border-0 bg-white"
                src={notice.url}
                title={notice.title}
            />
        );
    }

    return (
        <PageLayout
            className="overflow-x-hidden bg-gray-100"
            name="document-viewer"
            title="Xem văn bản"
            onBackClick={() => navigate(-1)}
        >
            <div className="border-b border-gray-200 bg-white px-4 py-3">
                {category && (
                    <div className="mb-1 text-xs font-semibold text-blue-600">
                        {category.title}
                    </div>
                )}

                <div className="line-clamp-3 text-sm font-bold leading-5 text-gray-900">
                    {notice.title}
                </div>

                {numPages > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                        {numPages} trang
                    </div>
                )}
            </div>

            {viewerContent}
        </PageLayout>
    );
};

export default DocumentViewerPage;

export { DocumentViewerPage };
