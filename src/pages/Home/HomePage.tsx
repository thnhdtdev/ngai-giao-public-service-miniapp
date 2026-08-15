import React from "react";

import PageLayout from "@components/layout/PageLayout";

import HeroSection from "@components/home/HeroSection";
import QuickActions from "@components/home/QuickActions";
import MainUtilities from "@components/home/MainUtilities";
import OfficialChannel from "@components/OfficialChannel";

const HomePage: React.FunctionComponent = () => (
    <PageLayout id="home-page" noHeader>
        <HeroSection />

        <QuickActions />
        <OfficialChannel  />
        <MainUtilities />
    </PageLayout>
);

export default HomePage;
