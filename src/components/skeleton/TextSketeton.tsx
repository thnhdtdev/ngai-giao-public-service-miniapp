import clsx from "clsx";
import React from "react";

const heightClasses: Record<number, string> = {
    16: "h-4",
    18: "h-5",
    20: "h-5",
    22: "h-6",
};

const widthClasses: Record<number, string> = {
    100: "w-24",
    150: "w-36",
};

const TextItemSkeleton: React.FunctionComponent<{
    height?: number;
    width?: number;
}> = ({ height = 18, width }) => (
    <div className="animate-pulse">
        <div
            className={clsx(
                "rounded-full bg-devider_1",
                heightClasses[height] || "h-5",
                width ? widthClasses[width] || "w-full" : "w-full",
            )}
        />
    </div>
);

export default TextItemSkeleton;
