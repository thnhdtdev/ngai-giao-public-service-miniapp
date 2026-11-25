import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter } from "zmp-ui";

import { HomePage } from "./Home";
import { lazyPage, preloadWhenIdle } from "./lazyPage";
import { DocumentViewerPage } from "./PublicNotices/documentViewerPage";

const QAPage = lazyPage(() => import("./QA"), "Trợ lý hỏi đáp");
const WorkingHoursPage = lazyPage(
    () => import("./WorkingHours"),
    "Giờ làm việc",
);
const OnlineGuidePage = lazyPage(
    () => import("./OnlineGuide"),
    "Hướng dẫn nộp hồ sơ online",
);
const CommonProceduresPage = lazyPage(
    () => import("./CommonProcedures"),
    "Thủ tục thường dùng",
);
const PublicNoticesPage = lazyPage(
    () => import("./PublicNotices"),
    "Niêm yết công khai",
);
const FeeSchedulePage = lazyPage(
    () => import("./PublicNotices/FeeSchedule"),
    "Phí, lệ phí",
);
const LocationPage = lazyPage(() => import("./Location"), "Địa chỉ Trung tâm");
const GuideVideosPage = lazyPage(
    () => import("./GuideVideos"),
    "Video hướng dẫn",
);
const OneStopGuidePage = lazyPage(
    () => import("./OneStopGuide"),
    "Hướng dẫn một cửa",
);
const ProcedureCatalogPage = lazyPage(
    () => import("./ProcedureCatalog"),
    "Tra cứu thủ tục",
);
const ProcedureDetailPage = lazyPage(
    () => import("./ProcedureCatalog/ProcedureDetail"),
    "Chi tiết thủ tục",
);
const BookingPage = lazyPage(() => import("./Booking"), "Đặt lịch hẹn");
const MyAppointmentsPage = lazyPage(
    () => import("./MyAppointments"),
    "Lịch hẹn của tôi",
);

const PRELOAD_ORDER = [
    ProcedureCatalogPage,
    ProcedureDetailPage,
    BookingPage,
    QAPage,
    PublicNoticesPage,
    MyAppointmentsPage,
    FeeSchedulePage,
    CommonProceduresPage,
    WorkingHoursPage,
    LocationPage,
    OnlineGuidePage,
    OneStopGuidePage,
    GuideVideosPage,
];

const Routes: React.FC = () => {
    useEffect(() => {
        preloadWhenIdle(PRELOAD_ORDER);
    }, []);

    return (
        <ZMPRouter>
            <AnimationRoutes>
                <Route path="/" element={<HomePage />} />
                <Route path="/working-hours" element={<WorkingHoursPage />} />
                <Route path="/qa" element={<QAPage />} />
                <Route path="/online-guide" element={<OnlineGuidePage />} />
                <Route
                    path="/public-notices/document/:noticeId"
                    element={<DocumentViewerPage />}
                />
                <Route
                    path="/common-procedures"
                    element={<CommonProceduresPage />}
                />
                <Route path="/public-notices" element={<PublicNoticesPage />} />
                <Route
                    path="/public-notices/fees"
                    element={<FeeSchedulePage />}
                />
                <Route path="/location" element={<LocationPage />} />
                <Route path="/guide-videos" element={<GuideVideosPage />} />
                <Route path="/one-stop-guide" element={<OneStopGuidePage />} />
                <Route path="/procedures" element={<ProcedureCatalogPage />} />
                <Route
                    path="/procedures/:procedureId"
                    element={<ProcedureDetailPage />}
                />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/appointments" element={<MyAppointmentsPage />} />
            </AnimationRoutes>
        </ZMPRouter>
    );
};

export default Routes;
