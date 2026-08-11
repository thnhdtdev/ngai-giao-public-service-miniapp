import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import HeroBackground from "@assets/background1.png";
import Logo from "@assets/logo-hcc.png";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";
import { openPhone } from "zmp-sdk";
import {
    Newspaper,
    Phone,
} from "lucide-react";

const Hero = styled.section`
    position: relative;
    overflow: hidden;

    min-height: 300px;

    padding:
        calc(var(--zaui-safe-area-inset-top, 0px) + 68px)
        16px
        28px;

    color: #ffffff;

    background-image: url(${HeroBackground});
    background-size: cover;
    background-position: center;
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;

    background:
        linear-gradient(
            180deg,
            rgba(3, 52, 101, 0.58) 0%,
            rgba(3, 73, 139, 0.76) 52%,
            rgba(4, 101, 188, 0.92) 100%
        );
`;

const Content = styled.div`
    position: relative;
    z-index: 1;
`;

const Identity = styled.div`
    display: flex;
    align-items: center;

    /*
     * Chừa vùng bên phải cho nút ... và X của Zalo
     */
    padding-right: 92px;
`;

const LogoWrapper = styled.div`
    width: 56px;
    height: 56px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: 12px;

    border-radius: 16px;

    // background: rgba(255, 255, 255, 0.12);
`;

const LogoImage = styled.img`
    width: 48px;
    height: 48px;
    object-fit: contain;
`;

const OrganizationBlock = styled.div`
    min-width: 0;
`;

const OrganizationLabel = styled.div`
    font-size: 12px;
    line-height: 17px;
    font-weight: 600;
    letter-spacing: 0.25px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.88);
`;

const OrganizationName = styled.div`
    margin-top: 2px;
    text-transform: uppercase;

    font-size: 16px;
    line-height: 21px;
    font-weight: 700;

    color: #ffffff;
`;

const MainContent = styled.div`
    margin-top: 24px;
`;

const Locality = styled.h1`
    margin: 0;

    font-size: 30px;
    line-height: 36px;

    font-weight: 700;

    letter-spacing: -0.4px;

    color: #ffffff;
`;

const Description = styled.p`
    max-width: 300px;

    margin: 8px 0 0;

    font-size: 14px;
    line-height: 20px;

    color: rgba(255, 255, 255, 0.9);
`;

const HeroActions = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;

    margin-top: 18px;
`;

const HeroAction = styled.button`
    min-width: 0;
    min-height: 70px;

    display: flex;
    align-items: center;

    gap: 9px;

    padding: 10px 11px;

    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;

    background:
        linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.16),
            rgba(128, 93, 190, 0.28)
        );

    color: #ffffff;
    text-align: left;

    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    box-shadow:
        0 6px 18px rgba(0, 35, 80, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.18);

    &:active {
        transform: scale(0.98);
    }
`;

const HeroActionIcon = styled.div`
    width: 40px;
    height: 40px;

    flex: 0 0 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            #e00000,
            #c40000
        );

    color: #ffffff;

    box-shadow: 0 4px 12px rgba(170, 0, 0, 0.28);
`;

const HeroActionContent = styled.div`
    min-width: 0;
`;

const HeroActionTitle = styled.div`
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;

    color: #ffffff;
`;

const HeroActionDescription = styled.div`
    margin-top: 3px;

    font-size: 11px;
    line-height: 15px;

    color: rgba(255, 255, 255, 0.8);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const HeroSection: React.FC = () => {
     const navigate = useNavigate();

    const handleCallHotline = async () => {
        const phoneNumber =
            NGAI_GIAO_ORGANIZATION.hotline.phoneNumber;

        if (!phoneNumber) {
            return;
        }

        try {
            await openPhone({
                phoneNumber,
            });
        } catch (error) {
            console.error("Không thể mở cuộc gọi:", error);
        }
    };

    return (
        <Hero>
            <Overlay />

            <Content>
                <Identity>
                    <LogoWrapper>
                        <LogoImage
                            src={Logo}
                            alt="Trung tâm Phục vụ Hành chính công Ngãi Giao"
                        />
                    </LogoWrapper>

                    <OrganizationBlock>
                        <OrganizationLabel>
                            Trung tâm Phục vụ
                        </OrganizationLabel>

                        <OrganizationName>
                            Hành chính công
                        </OrganizationName>
                    </OrganizationBlock>
                </Identity>

                <MainContent>
                    <Locality>
                        {NGAI_GIAO_ORGANIZATION.locality}
                    </Locality>

                    <Description>
                        Đồng hành cùng người dân trong thực hiện
                        thủ tục hành chính nhanh chóng, minh bạch
                        và thuận tiện.
                    </Description>

                    <HeroActions>
    <HeroAction
        type="button"
        onClick={() => navigate("/news")}
    >
        <HeroActionIcon>
            <Newspaper
                size={22}
                strokeWidth={2}
            />
        </HeroActionIcon>

        <HeroActionContent>
            <HeroActionTitle>
                Tin tức nổi bật
            </HeroActionTitle>

            <HeroActionDescription>
                Cập nhật mới nhất
            </HeroActionDescription>
        </HeroActionContent>
    </HeroAction>

    <HeroAction
        type="button"
        onClick={() => void handleCallHotline()}
    >
        <HeroActionIcon>
            <Phone
                size={22}
                strokeWidth={2}
            />
        </HeroActionIcon>

        <HeroActionContent>
            <HeroActionTitle>
                Đường dây nóng
            </HeroActionTitle>

            <HeroActionDescription>
                {NGAI_GIAO_ORGANIZATION.hotline.display}
            </HeroActionDescription>
        </HeroActionContent>
    </HeroAction>
</HeroActions>
                    
                </MainContent>
            </Content>
        </Hero>
    );
};

export default HeroSection;