import React from "react";
import TextItemSkeleton from "./TextSketeton";

const FeedbackItemSkeleton: React.FunctionComponent = () => (
    <div className="mt-4 first:mt-0">
        <div className="h-36 w-full animate-pulse rounded bg-devider_1" />
        <div className="grid grid-cols-2 gap-4 overflow-hidden">
            <div className="mt-2">
                <TextItemSkeleton width={150} height={16} />
            </div>
            <div className="mt-2 flex justify-end">
                <TextItemSkeleton width={100} height={16} />
            </div>
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="mt-2">
                <TextItemSkeleton height={20} />
            </div>
            <div className="mt-1">
                <TextItemSkeleton height={20} />
            </div>
        </div>
    </div>
);

export default FeedbackItemSkeleton;
