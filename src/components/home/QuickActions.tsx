import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { openWebview } from "zmp-sdk";

type ActionItem =
    | {
          id: string;
          type: "route";
          title: string;
          description: string;
          icon: React.ReactNode;
          path: string;
      }
    | {
          id: string;
          type: "external";
          title: string;
          description: string;
          icon: React.ReactNode;
          url: string;
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

const Action = styled.button`
    min-height: 120px;
    padding: 16px;

    border: 1px solid #e5e7eb;
    border-radius: 16px;

    background: #ffffff;

    text-align: left;

    display: flex;
    flex-direction: column;

    &:active {
        transform: scale(0.98);
    }
`;

const Icon = styled.div`
    width: 42px;
    height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 12px;

    background: #eaf4ff;

    font-size: 22px;
`;

const ActionTitle = styled.div`
    margin-top: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #202124;
`;

const Description = styled.div`
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.4;
    color: #6b7280;
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
        icon: "🔎",
        title: "Tra cứu hồ sơ",
        description: "Tra cứu trên Cổng Dịch vụ công Quốc gia",
        url: "https://dichvucong.gov.vn/tra-cuu-ho-so",
    },
    {
        id: "procedures",
        type: "route",
        icon: "📄",
        title: "Thủ tục hành chính",
        description: "Xem hồ sơ cần chuẩn bị trước khi đến",
        path: "/information-guide",
    },
    {
        id: "guidelines",
        type: "route",
        icon: "🏛️",
        title: "Hướng dẫn Một cửa",
        description: "Quy trình thực hiện thủ tục tại Bộ phận Một cửa",
        path: "/guidelines",
    },
    {
        id: "feedback",
        type: "external",
        icon: "💬",
        title: "Phản ánh, kiến nghị",
        description: "Gửi phản ánh, kiến nghị trên Cổng Dịch vụ công Quốc gia",
        url: "https://dichvucong.gov.vn/nop-phan-anh-kien-nghi",
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
                        onClick={() => void handleAction(action)}
                    >
                        {action.icon}

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