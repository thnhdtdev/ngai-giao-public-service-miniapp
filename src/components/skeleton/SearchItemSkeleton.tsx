import React from "react";
import TextItemSkeleton from "./TextSketeton";

const SearchItemSkeleton: React.FunctionComponent = () => (
    <div className="px-3 py-4">
        <div className="pr-6">
            <div className="mb-1">
                <TextItemSkeleton height={22} />
            </div>
            <TextItemSkeleton />
        </div>
    </div>
);

export default SearchItemSkeleton;
