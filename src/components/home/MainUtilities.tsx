import React from "react";
import styled from "styled-components";
import { openWebview } from "zmp-sdk";
import {
    Globe2,
    FileDown,
    CalendarDays,
    Clock3,
    ContactRound,
    CircleHelp,
    CirclePlay,
    Star,
} from "lucide-react";

type UtilityItem =
    | {
          id: string;
          type: "external";
          title: string;
          icon: React.ReactNode;
          url: string;
          color: string;
          background: string;
      }
    | {
          id: string;
          type: "coming-soon";
          title: string;
          icon: React.ReactNode;
          color: string;
          background: string;
      };

const Section = styled.section`
    padding: 6px 16px 22px;
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
`;

const TitleIcon = styled.div`
    color: #1677ff;

    display: flex;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h2`
    margin: 0;

    font-size: 19px;
    line-height: 26px;
    font-weight: 700;

    color: #202124;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));

    column-gap: 10px;
    row-gap: 20px;
`;

const UtilityButton = styled.button`
    appearance: none;

    border: 0;
    padding: 0;
    margin: 0;

    background: transparent;

    display: flex;
    flex-direction: column;
    align-items: center;

    min-width: 0;

    cursor: pointer;

    &:active {
        opacity: 0.72;
    }
`;

const IconBox = styled.div<{
    $background: string;
    $color: string;
}>`
    width: 58px;
    height: 58px;

    border-radius: 17px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${({ $color }) => $color};
    background: ${({ $background }) => $background};

    border: 1px solid rgba(47, 128, 237, 0.07);

    box-shadow:
        0 5px 15px rgba(30, 64, 175, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);

    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;

    ${UtilityButton}:active & {
        transform: scale(0.94);
        box-shadow: 0 2px 7px rgba(30, 64, 175, 0.08);
    }
`;

const UtilityTitle = styled.div`
    width: 100%;

    margin-top: 8px;

    font-size: 12.5px;
    line-height: 17px;
    font-weight: 600;

    color: #3f4652;

    text-align: center;

    overflow-wrap: break-word;

    @media (max-width: 350px) {
        font-size: 11.5px;
        line-height: 16px;
    }
`;

const utilities: UtilityItem[] = [
    {
        id: "online-service",
        type: "external",
        title: "Nộp hồ sơ trực tuyến",
        icon: <Globe2 size={28} strokeWidth={2} />,
        url: "https://dichvucong.gov.vn/p/home/dvc-dich-vu-cong-truc-tuyen-ds.html",
        color: "#2563EB",
        background: "#EAF2FF",
    },
    {
        id: "forms",
        type: "coming-soon",
        title: "Biểu mẫu TTHC",
        icon: <FileDown size={28} strokeWidth={2} />,
        color: "#7C3AED",
        background: "#F1EAFE",
    },
    {
        id: "citizen-reception",
        type: "coming-soon",
        title: "Lịch tiếp công dân",
        icon: <CalendarDays size={28} strokeWidth={2} />,
        color: "#E85D04",
        background: "#FFF1E8",
    },
    {
        id: "working-hours",
        type: "coming-soon",
        title: "Giờ làm việc",
        icon: <Clock3 size={28} strokeWidth={2} />,
        color: "#0891B2",
        background: "#E7F8FB",
    },
    {
        id: "departments",
        type: "coming-soon",
        title: "Danh bạ bộ phận",
        icon: <ContactRound size={28} strokeWidth={2} />,
        color: "#16A34A",
        background: "#E9F9EE",
    },
    {
        id: "faq",
        type: "coming-soon",
        title: "Câu hỏi thường gặp",
        icon: <CircleHelp size={28} strokeWidth={2} />,
        color: "#0284C7",
        background: "#E8F5FC",
    },
    {
        id: "videos",
        type: "coming-soon",
        title: "Video hướng dẫn",
        icon: <CirclePlay size={28} strokeWidth={2} />,
        color: "#DB2777",
        background: "#FCEAF3",
    },
    {
        id: "rating",
        type: "coming-soon",
        title: "Đánh giá hài lòng",
        icon: <Star size={28} strokeWidth={2} />,
        color: "#D97706",
        background: "#FFF5D9",
    },
];

const MainUtilities: React.FC = () => {
    const handleUtility = async (item: UtilityItem) => {
        if (item.type === "external") {
            try {
                await openWebview({
                    url: item.url,
                });
            } catch (error) {
                console.error("Không thể mở liên kết:", error);
            }

            return;
        }
    };

    return (
        <Section>
            <TitleRow>
                <TitleIcon>
                    <Star size={22} strokeWidth={2} />
                </TitleIcon>

                <Title>Tiện ích chính</Title>
            </TitleRow>

            <Grid>
                {utilities.map((item) => (
                    <UtilityButton
                        key={item.id}
                        type="button"
                        onClick={() => void handleUtility(item)}
                    >
                        <IconBox
                            $background={item.background}
                            $color={item.color}
                        >
                            {item.icon}
                        </IconBox>

                        <UtilityTitle>
                            {item.title}
                        </UtilityTitle>
                    </UtilityButton>
                ))}
            </Grid>
        </Section>
    );
};

export default MainUtilities;