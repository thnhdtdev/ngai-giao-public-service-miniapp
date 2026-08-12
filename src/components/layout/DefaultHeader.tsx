import React, { FC } from "react";
import { Header, Icon } from "zmp-ui";

export interface DefaultHeaderProps {
    title?: string;
    back?: boolean;
}

const DefaultHeader: FC<DefaultHeaderProps> = ({ title, back }) => (
    <Header
        className="app-default-header h-safe-header fixed left-0 top-0 z-10 flex w-full items-center bg-main px-4 text-white"
        title={title}
        backIcon={<Icon icon="zi-arrow-left" />}
        showBackIcon={back}
    />
);

export default DefaultHeader;
