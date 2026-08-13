import Logo from "@assets/logo.png";
import { OA } from "@dts";
import { useStore } from "@store";
import React, { FunctionComponent } from "react";
import { Avatar, Button, List } from "zmp-ui";

export interface OAItemProps {
    officialAccount: OA;
}

const OAItem: FunctionComponent<OAItemProps> = ({ officialAccount }) => {
    const { name, logoUrl, oaId, follow } = officialAccount;
    const followOA = useStore(state => state.followOA);

    return (
        <List.Item
            className="app-oa-item p-0"
            title={name}
            subTitle={name}
            prefix={<Avatar size={40} src={logoUrl || Logo} />}
            suffix={
                <Button
                    size="small"
                    variant="secondary"
                    type="neutral"
                    disabled={follow}
                    onClick={() => followOA({ id: oaId })}
                >
                    Quan Tâm
                </Button>
            }
        />
    );
};

export default OAItem;
