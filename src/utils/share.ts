import { openShareSheet } from "zmp-sdk";

import shareThumbnail from "@assets/logo-hcc.png";

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 400;

const truncate = (text: string, maxLength: number) => {
    const normalized = text.trim().replace(/\s+/g, " ");

    return normalized.length > maxLength
        ? `${normalized.slice(0, maxLength - 1).trimEnd()}…`
        : normalized;
};

export interface SharePageOptions {
    title: string;
    description?: string;
    path: string;
}

export const sharePage = ({ title, description, path }: SharePageOptions) =>
    openShareSheet({
        type: "zmp",
        data: {
            title: truncate(title, TITLE_MAX_LENGTH),
            description: truncate(description ?? "", DESCRIPTION_MAX_LENGTH),
            thumbnail: new URL(shareThumbnail, window.location.href).href,
            path,
        },
    });
