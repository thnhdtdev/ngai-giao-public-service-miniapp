import React, { FC } from "react";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";
import Background from "@assets/header-background.png";
import Logo from "@assets/logo.png";

export interface HomeHeaderProps {
    title: string;
    name: string;
}

const HomeHeader: FC<HomeHeaderProps> = ({ title, name }) => (
    <header className="h-safe-home-header fixed inset-x-0 top-0 z-50 overflow-hidden border-b border-white/20 pt-safe-top text-white shadow-sm">
        <img
            className="absolute inset-0 h-full w-full object-cover"
            src={Background}
            alt=""
            aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/95 to-blue-500/95" />

        <div className="relative flex h-14 items-center pl-4 pr-28">
            <div className="mr-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/20">
                <img
                    className="h-7 w-7 object-contain"
                    src={Logo}
                    alt={NGAI_GIAO_ORGANIZATION.organization.name}
                />
            </div>
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold uppercase leading-5 tracking-wide">
                    {title}
                </div>
                <div className="mt-px truncate text-xs leading-4 text-white/80">
                    {name}
                </div>
            </div>
        </div>
    </header>
);

export default HomeHeader;
