import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import HeroBackground from "@assets/background1.png";
import Logo from "@assets/logo-hcc.png";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";

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

const SearchButton = styled.button`
    width: 100%;

    margin-top: 24px;

    min-height: 50px;

    display: flex;
    align-items: center;

    gap: 10px;

    padding: 0 16px;

    border: none;
    border-radius: 14px;

    background: rgba(255, 255, 255, 0.97);

    color: #59616b;

    text-align: left;

    font-size: 14px;

    box-shadow: 0 8px 24px rgba(0, 45, 90, 0.14);

    &:active {
        transform: scale(0.99);
    }
`;

const SearchIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="2"
        />

        <path
            d="M16.5 16.5L21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

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

                    <SearchButton
                        type="button"
                        onClick={() =>
                            navigate("/information-guide")
                        }
                    >
                        <SearchIcon />

                        Tìm kiếm thủ tục hành chính
                    </SearchButton>
                </MainContent>
            </Content>
        </Hero>
    );
};

export default HeroSection;