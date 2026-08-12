import React from "react";

import { HomeHeader } from "@components";
import PageLayout from "@components/layout/PageLayout";

import HeroSection from "@components/home/HeroSection";
import QuickActions from "@components/home/QuickActions";
import MainUtilities from "@components/home/MainUtilities";

const HomePage: React.FunctionComponent = () => {
    return (

        <PageLayout
            id="home-page"
            bg="#F5F6F8"
            noHeader
        >
            <HeroSection />

            <QuickActions />

            <MainUtilities />
        </PageLayout>

    );
};

export default HomePage;