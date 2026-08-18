import React from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter } from "zmp-ui";

import { HomePage } from "./Home";
import { QAPage } from "./QA";
import { CommonProceduresPage } from "./CommonProcedures";
import { WorkingHoursPage } from "./WorkingHours";
import { OnlineGuidePage } from "./OnlineGuide";
import { LocationPage } from "./Location";
import { PublicNoticesPage } from "./PublicNotices";

const Routes: React.FC = () => (
    <ZMPRouter>
        <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/working-hours" element={<WorkingHoursPage />} />
            <Route path="/qa" element={<QAPage />} />
            <Route path="/online-guide" element={<OnlineGuidePage />} />
            <Route
                path="/common-procedures"
                element={<CommonProceduresPage />}
            />
            <Route path="/public-notices" element={<PublicNoticesPage />} />
            <Route path="/location" element={<LocationPage />} />
        </AnimationRoutes>
    </ZMPRouter>
);

export default Routes;
