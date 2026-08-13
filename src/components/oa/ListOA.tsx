import { OAItemSkeleton } from "@components/skeleton";
import { useStore } from "@store";
import React, { FC } from "react";
import { List, Text } from "zmp-ui";
import OAItem from "./OAItem";

const ListOA: FC = () => {
    const { officialAccounts } = useStore(state => state.organization) || {
        officialAccounts: [],
    };
    const loading = useStore(state => state.gettingOrganization);

    return (
        <section className="mt-2 bg-ui_bg p-4">
            <Text.Title size="small">Danh bạ</Text.Title>
            <Text className="text-text_2" size="small">
                OA chính thức của cơ quan nhà nước
            </Text>
            <List className="mt-4 py-2">
                {!loading &&
                    officialAccounts?.map(item => (
                        <OAItem key={item.oaId} officialAccount={item} />
                    ))}
                {loading && <OAItemSkeleton />}
            </List>
        </section>
    );
};

export default ListOA;
