import React from "react";
import TextItemSkeleton from "./TextSketeton";

const InformationGuideItemSkeleton: React.FunctionComponent = () => (
    <div className="mt-4 first:mt-0">
        <div className="p-2">
            <div className="p-2">
                <TextItemSkeleton height={20} />
            </div>
            <div className="flex-1 overflow-hidden p-2">
                <TextItemSkeleton height={20} />
            </div>
        </div>
        <div className="my-2 border-b border-ng_10" />
    </div>
);

export default InformationGuideItemSkeleton;
