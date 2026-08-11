import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { openWebview } from "zmp-sdk";
import {
    Search,
    FileText,
    Landmark,
    MessageCircle,
} from "lucide-react";

type ActionItem =
    | {
          id: string;
          type: "route";
          title: string;
          description: string;
          icon: React.ReactNode;
          path: string;
          background: string;
          iconColor: string;
      }
    | {
          id: string;
          type: "external";
          title: string;
          description: string;
          icon: React.ReactNode;
          url: string;
          background: string;
          iconColor: string;
      };

const Section = styled.section`
    padding: 20px 16px;
`;

const Title = styled.h2`
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 600;
    color: #202124;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
`;

const Action = styled.button<{
    $background: string;
}>`
    position: relative;
    overflow: hidden;

    min-height: 125px;
    padding: 16px;

    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 17px;

    background: ${({ $background }) => $background};

    display: flex;
    flex-direction: column;

    text-align: left;

    box-shadow:
        0 8px 20px rgba(26, 66, 130, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);

    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;

    &::after {
        content: "";

        position: absolute;
        top: -35px;
        right: -35px;

        width: 100px;
        height: 100px;

        border-radius: 50%;

        background: rgba(255, 255, 255, 0.09);
    }

    &:active {
        transform: scale(0.97);

        box-shadow:
            0 4px 12px rgba(26, 66, 130, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
`;

const Icon = styled.div<{
    $color: string;
}>`
    position: relative;
    z-index: 1;

    width: 42px;
    height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 13px;

    background: rgba(255, 255, 255, 0.17);

    border: 1px solid rgba(255, 255, 255, 0.18);

    color: ${({ $color }) => $color};

    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
`;

const ActionTitle = styled.div`
    position: relative;
    z-index: 1;

    margin-top: 12px;

    font-size: 15px;
    line-height: 20px;
    font-weight: 700;

    color: #ffffff;
`;

const Description = styled.div`
    position: relative;
    z-index: 1;

    margin-top: 4px;

    font-size: 12px;
    line-height: 1.4;

    color: rgba(255, 255, 255, 0.82);
`;

const handleLookupDossier = async () => {
    await openWebview({
        url: "https://dichvucong.gov.vn/tra-cuu-ho-so",
    });
}

const actions: ActionItem[] = [
    {
        id: "lookup-dossier",
        type: "external",
        icon: <Search size={23} strokeWidth={2.2} />,
        title: "Tra cứu hồ sơ",
        description: "Kiểm tra trạng thái hồ sơ",
        url: "https://dichvucong.gov.vn/tra-cuu-ho-so",

        background:
            "linear-gradient(135deg, #2F80ED 0%, #2563EB 100%)",
        iconColor: "#FFFFFF",
    },
    {
        id: "procedures",
        type: "route",
        icon: <FileText size={23} strokeWidth={2.2} />,
        title: "Thủ tục hành chính",
        description: "Xem hồ sơ cần chuẩn bị trước khi đến",
        path: "/information-guide",

        background:
            "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
        iconColor: "#FFFFFF",
    },
    {
        id: "guidelines",
        type: "route",
        icon: <Landmark size={23} strokeWidth={2.2} />,
        title: "Hướng dẫn Một cửa",
        description: "Quy trình thực hiện thủ tục tại Trung tâm",
        path: "/guidelines",

        background:
            "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
        iconColor: "#FFFFFF",
    },
    {
        id: "feedback",
        type: "external",
        icon: <MessageCircle size={23} strokeWidth={2.2} />,
        title: "Phản ánh, kiến nghị",
        description: "Gửi phản ánh trên Cổng DVCQG",
        url: "https://dichvucong.gov.vn/nop-phan-anh-kien-nghi",

        background:
            "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
        iconColor: "#FFFFFF",
    },
];

const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    const handleAction = async (action: ActionItem) => {
        if (action.type === "route") {
            navigate(action.path);
            return;
        }

        if (action.type === "external") {
            await openWebview({
                url: action.url,
            });
        }
    };

    return (
        <Section>
            <Title>Dịch vụ công</Title>

            <Grid>
                {actions.map(action => (
    <Action
        key={action.id}
        type="button"
        $background={action.background}
        onClick={() => void handleAction(action)}
    >
        <Icon $color={action.iconColor}>
            {action.icon}
        </Icon>

        <ActionTitle>
            {action.title}
        </ActionTitle>

        <Description>
            {action.description}
        </Description>
    </Action>
))}
            </Grid>
        </Section>
    );
};

export default QuickActions;