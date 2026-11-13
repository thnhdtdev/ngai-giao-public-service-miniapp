import { LoaderCircle } from "lucide-react";
import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter } from "zmp-ui";

import PageLayout from "@components/layout/PageLayout";
import RouteErrorBoundary from "@components/RouteErrorBoundary";

import { HomePage } from "./Home";
import { QAPage } from "./QA";
import { CommonProceduresPage } from "./CommonProcedures";
import { WorkingHoursPage } from "./WorkingHours";
import { OnlineGuidePage } from "./OnlineGuide";
import { LocationPage } from "./Location";
import { PublicNoticesPage } from "./PublicNotices";
import { GuideVideosPage } from "./GuideVideos";
import { OneStopGuidePage } from "./OneStopGuide";
import { ProcedureCatalogPage } from "./ProcedureCatalog";
import { ProcedureDetailPage } from "./ProcedureCatalog/ProcedureDetail";
import { BookingPage } from "./Booking";
import { MyAppointmentsPage } from "./MyAppointments";
import { loadDocumentViewer } from "./PublicNotices/loadDocumentViewer";

const DocumentViewerPage = lazy(loadDocumentViewer);

const DOCUMENT_VIEWER_TITLE = "Xem văn bản";

const DocumentViewerFallback: React.FC = () => (
    <PageLayout className="bg-gray-100" title={DOCUMENT_VIEWER_TITLE}>
        <div className="flex min-h-64 items-center justify-center text-blue-600">
            <LoaderCircle className="h-7 w-7 animate-spin" />
        </div>
    </PageLayout>
);

const Routes: React.FC = () => (
    <ZMPRouter>
        <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/working-hours" element={<WorkingHoursPage />} />
            <Route path="/qa" element={<QAPage />} />
            <Route path="/online-guide" element={<OnlineGuidePage />} />
            <Route
                path="/public-notices/document/:noticeId"
                element={
                    <RouteErrorBoundary title={DOCUMENT_VIEWER_TITLE}>
                        <Suspense fallback={<DocumentViewerFallback />}>
                            <DocumentViewerPage />
                        </Suspense>
                    </RouteErrorBoundary>
                }
            />
            <Route
                path="/common-procedures"
                element={<CommonProceduresPage />}
            />
            <Route path="/public-notices" element={<PublicNoticesPage />} />
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

export default Routes;
