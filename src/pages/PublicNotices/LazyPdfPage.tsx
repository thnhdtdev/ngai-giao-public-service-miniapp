import React, { useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";

// Tỉ lệ A4 để giữ chỗ trước khi trang thật được render
const A4_RATIO = 1.414;
const EAGER_PAGES = 2;
const PRELOAD_MARGIN = "800px 0px";

type LazyPdfPageProps = {
    pageNumber: number;
    totalPages: number;
    width: number;
    loading: React.ReactNode;
};

/**
 * Chỉ render canvas khi trang sắp vào viewport, tránh vẽ toàn bộ văn bản
 * dài cùng lúc trên thiết bị yếu.
 */
const LazyPdfPage: React.FC<LazyPdfPageProps> = ({
    pageNumber,
    totalPages,
    width,
    loading,
}) => {
    const containerRef = useRef<HTMLElement>(null);
    const [shouldRender, setShouldRender] = useState(pageNumber <= EAGER_PAGES);

    useEffect(() => {
        const container = containerRef.current;

        if (shouldRender || !container) {
            return undefined;
        }

        if (typeof IntersectionObserver === "undefined") {
            setShouldRender(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    setShouldRender(true);
                    observer.disconnect();
                }
            },
            { rootMargin: PRELOAD_MARGIN },
        );

        observer.observe(container);

        return () => observer.disconnect();
    }, [shouldRender]);

    return (
        <section
            className="mb-3 overflow-hidden rounded-lg bg-white shadow-sm last:mb-0"
            ref={containerRef}
        >
            <div className="border-b border-gray-100 px-3 py-2 text-center text-xs font-medium text-gray-500">
                Trang {pageNumber} / {totalPages}
            </div>

            {shouldRender ? (
                <Page
                    loading={loading}
                    pageNumber={pageNumber}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    width={width}
                />
            ) : (
                <div
                    aria-hidden="true"
                    style={{ height: Math.round(width * A4_RATIO) }}
                />
            )}
        </section>
    );
};

export default React.memo(LazyPdfPage);
