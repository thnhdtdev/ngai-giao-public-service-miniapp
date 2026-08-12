import React from "react";

import PageLayout from "@components/layout/PageLayout";

import HeroSection from "@components/home/HeroSection";
import QuickActions from "@components/home/QuickActions";
import MainUtilities from "@components/home/MainUtilities";

const HomePage: React.FunctionComponent = () => (
    <PageLayout id="home-page" noHeader>
        <HeroSection />

        <QuickActions />

        <MainUtilities />
    </PageLayout>
);

export default HomePage;
