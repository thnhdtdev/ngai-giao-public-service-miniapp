import { lazyPage } from "../lazyPage";

// Trình xem PDF nặng (pdf.js) nên tách riêng; danh sách niêm yết gọi
// preload() khi người dùng mở một nhóm văn bản.
export const DocumentViewerPage = lazyPage(
    () => import("./DocumentViewer"),
    "Xem văn bản",
);
