import clsx from "clsx";
import React from "react";

const sizeClasses: Record<number, string> = {
    40: "h-10 w-10",
    48: "h-12 w-12",
    64: "h-16 w-16",
};

const AvatarSkeleton: React.FunctionComponent<{ size?: number }> = ({
    size = 40,
}) => (
    <div
        className={clsx(
            "animate-pulse rounded-full bg-devider_1",
            sizeClasses[size] || "h-10 w-10",
        )}
    />
);

export default AvatarSkeleton;
