import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Clock3,
    CalendarDays,
    Info,
} from "lucide-react";

const Page = styled.div`
    min-height: 100vh;
    background: #f5f7fb;
`;

const Header = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;

    height: 56px;
    padding: 0 16px;

    display: flex;
    align-items: center;

    background: #ffffff;
    border-bottom: 1px solid #edf0f5;
`;

const BackButton = styled.button`
    width: 40px;
    height: 40px;

    padding: 0;
    border: 0;
    border-radius: 12px;

    background: transparent;
    color: #202124;

    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
        background: #f1f3f5;
    }
`;

const HeaderTitle = styled.div`
    margin-left: 8px;

    font-size: 17px;
    font-weight: 700;

    color: #202124;
`;

const Content = styled.div`
    padding: 18px 16px 28px;
`;

const IntroCard = styled.div`
    padding: 18px;

    border-radius: 20px;

    color: #ffffff;

    background: linear-gradient(
        135deg,
        #0891b2 0%,
        #0e7490 100%
    );

    box-shadow: 0 8px 22px rgba(8, 145, 178, 0.18);
`;

const IntroIcon = styled.div`
    width: 46px;
    height: 46px;

    border-radius: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const IntroTitle = styled.div`
    margin-top: 14px;

    font-size: 19px;
    line-height: 26px;
    font-weight: 700;
`;

const IntroDescription = styled.div`
    margin-top: 5px;

    font-size: 13px;
    line-height: 19px;

    color: rgba(255, 255, 255, 0.88);
`;

const SectionTitle = styled.div`
    margin: 22px 0 12px;

    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 16px;
    font-weight: 700;

    color: #252a34;
`;

const ScheduleCard = styled.div`
    padding: 4px 16px;

    border-radius: 18px;

    background: #ffffff;

    border: 1px solid #edf0f5;

    box-shadow: 0 4px 16px rgba(20, 40, 80, 0.06);
`;

const ScheduleRow = styled.div`
    padding: 15px 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    &:not(:last-child) {
        border-bottom: 1px solid #eef1f5;
    }
`;

const ScheduleLabel = styled.div`
    min-width: 0;
`;

const Day = styled.div`
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;

    color: #252a34;
`;

const Period = styled.div`
    margin-top: 3px;

    font-size: 12px;
    line-height: 18px;

    color: #747b88;
`;

const Time = styled.div`
    flex-shrink: 0;

    padding: 7px 10px;

    border-radius: 10px;

    background: #e7f8fb;
    color: #087d99;

    font-size: 13px;
    font-weight: 700;
`;

const Notice = styled.div`
    margin-top: 16px;
    padding: 14px;

    display: flex;
    align-items: flex-start;
    gap: 10px;

    border-radius: 15px;

    background: #fff9e8;
    border: 1px solid #f8e7a8;

    color: #6c5a20;

    font-size: 13px;
    line-height: 19px;
`;

export const WorkingHoursPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Page>
            <Header>
                <BackButton
                    type="button"
                    aria-label="Quay lại"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={22} />
                </BackButton>

                <HeaderTitle>Giờ làm việc</HeaderTitle>
            </Header>

            <Content>
                <IntroCard>
                    <IntroIcon>
                        <Clock3 size={26} />
                    </IntroIcon>

                    <IntroTitle>
                        Trung tâm Hành chính công xã Ngãi Giao
                    </IntroTitle>

                    <IntroDescription>
                        Thời gian tiếp nhận và giải quyết thủ tục hành chính
                        tại Trung tâm.
                    </IntroDescription>
                </IntroCard>

                <SectionTitle>
                    <CalendarDays size={20} color="#0891B2" />
                    Lịch làm việc
                </SectionTitle>

                <ScheduleCard>
                    <ScheduleRow>
                        <ScheduleLabel>
                            <Day>Thứ Hai - Thứ Sáu</Day>
                            <Period>Buổi sáng</Period>
                        </ScheduleLabel>

                        <Time>07:30 - 11:30</Time>
                    </ScheduleRow>

                    <ScheduleRow>
                        <ScheduleLabel>
                            <Day>Thứ Hai - Thứ Sáu</Day>
                            <Period>Buổi chiều</Period>
                        </ScheduleLabel>

                        <Time>13:30 - 17:00</Time>
                    </ScheduleRow>

                    <ScheduleRow>
                        <ScheduleLabel>
                            <Day>Thứ Bảy</Day>
                            <Period>Buổi sáng</Period>
                        </ScheduleLabel>

                        <Time>07:30 - 11:30</Time>
                    </ScheduleRow>

                    <ScheduleRow>
                        <ScheduleLabel>
                            <Day>Thứ Bảy</Day>
                            <Period>Buổi chiều</Period>
                        </ScheduleLabel>

                        <Time>Nghỉ</Time>
                    </ScheduleRow>

                    <ScheduleRow>
                        <ScheduleLabel>
                            <Day>Chủ nhật</Day>
                            <Period>Lịch làm việc</Period>
                        </ScheduleLabel>

                        <Time>Nghỉ</Time>
                    </ScheduleRow>
                </ScheduleCard>

                <Notice>
                    <Info
                        size={20}
                        style={{ flexShrink: 0, marginTop: 1 }}
                    />

                    <span>
                        Trung tâm làm việc từ Thứ Hai đến sáng Thứ Bảy.
                        Nghỉ chiều Thứ Bảy, Chủ nhật và các ngày nghỉ lễ, Tết theo quy định.
                    </span>
                </Notice>
            </Content>
        </Page>
    );
};

export default WorkingHoursPage;