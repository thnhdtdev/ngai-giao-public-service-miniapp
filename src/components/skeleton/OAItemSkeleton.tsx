import React from "react";
import AvatarSkeleton from "./AvatarSkeleton";
import TextItemSkeleton from "./TextSketeton";

const OAItemSkeleton: React.FunctionComponent = () => (
    <div className="flex">
        <AvatarSkeleton />
        <div className="ml-2 flex-1 pr-24">
            <TextItemSkeleton height={20} />
            <div className="mt-1">
                <TextItemSkeleton />
            </div>
        </div>
    </div>
);

export default OAItemSkeleton;
