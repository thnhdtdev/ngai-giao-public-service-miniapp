import React from "react";
import TextItemSkeleton from "./TextSketeton";

const NewsItemSkeleton: React.FunctionComponent = () => (
    <div className="mt-4 first:mt-0">
        <div className="flex">
            <div className="h-20 w-20 animate-pulse rounded bg-devider_1" />
            <div className="ml-3 flex-1 overflow-hidden">
                <div className="mt-2">
                    <TextItemSkeleton height={16} />
                </div>
                <div className="mt-2">
                    <TextItemSkeleton height={20} />
                </div>
                <div className="mt-1">
                    <TextItemSkeleton height={20} />
                </div>
            </div>
        </div>
    </div>
);

export default NewsItemSkeleton;
