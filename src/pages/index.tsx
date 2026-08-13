import React from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter } from "zmp-ui";

import { HomePage } from "./Home";
import { QAPage } from "./QA";

import { WorkingHoursPage } from "./WorkingHours";
import { OnlineGuidePage } from "./OnlineGuide";

const Routes: React.FC = () => (
    <ZMPRouter>
        <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/working-hours" element={<WorkingHoursPage />} />
            <Route path="/qa" element={<QAPage />} />
            <Route path="/online-guide" element={<OnlineGuidePage />} />
        </AnimationRoutes>
    </ZMPRouter>
);

export default Routes;
