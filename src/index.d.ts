declare module "*.jpg";
declare module "*.png";
declare module "*.pdf";

declare module "react-pdf" {
    import { ComponentType, ReactNode } from "react";

    type DocumentProps = {
        children?: ReactNode;
        error?: ReactNode;
        file: string;
        loading?: ReactNode;
        onLoadError?: (error: Error) => void;
        onLoadSuccess?: (document: { numPages: number }) => void;
    };

    type PageProps = {
        loading?: ReactNode;
        pageNumber: number;
        renderAnnotationLayer?: boolean;
        renderTextLayer?: boolean;
        width?: number;
    };

    export const Document: ComponentType<DocumentProps>;
    export const Page: ComponentType<PageProps>;
    export const pdfjs: {
        GlobalWorkerOptions: {
            workerSrc: string;
        };
    };
}

interface Window {
    isBack: boolean;
}
