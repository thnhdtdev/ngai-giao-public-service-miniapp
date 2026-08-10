import React, { FC } from "react";
import styled from "styled-components";

import Logo from "@assets/logo.png";
import Background from "@assets/header-background.png";

export interface HomeHeaderProps {
    title: string;
    name: string;
}

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    height: calc(
        56px + var(--zaui-safe-area-inset-top, 0px)
    );

    padding-top: var(--zaui-safe-area-inset-top, 0px);

    z-index: 100;
    color: #ffffff;

    background:
        linear-gradient(
            90deg,
            rgba(4, 90, 170, 0.98) 0%,
            rgba(6, 116, 204, 0.94) 100%
        ),
        url(${Background});

    background-size: cover;
    background-position: center;

    border-bottom: 1px solid rgba(255, 255, 255, 0.14);

    box-shadow:
        0 2px 8px rgba(0, 52, 104, 0.12);
`;

const HeaderContent = styled.div`
    height: 56px;

    display: flex;
    align-items: center;

    padding-left: 16px;

    /*
     * Chừa khoảng trống cho nút "... / X"
     * do Zalo hiển thị ở góc phải.
     */
    padding-right: 108px;
`;

const LogoWrapper = styled.div`
    width: 36px;
    height: 36px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: 10px;

    border-radius: 10px;

    background: rgba(255, 255, 255, 0.16);

    border: 1px solid rgba(255, 255, 255, 0.22);
`;

const LogoImage = styled.img`
    width: 26px;
    height: 26px;

    object-fit: contain;
`;

const TextContainer = styled.div`
    min-width: 0;
    flex: 1;
`;

const Title = styled.div`
    overflow: hidden;

    font-size: 14px;
    line-height: 18px;

    font-weight: 700;

    letter-spacing: 0.2px;

    white-space: nowrap;
    text-overflow: ellipsis;

    text-transform: uppercase;
`;

const OrganizationName = styled.div`
    margin-top: 1px;

    overflow: hidden;

    font-size: 11px;
    line-height: 15px;

    font-weight: 400;

    color: rgba(255, 255, 255, 0.82);

    white-space: nowrap;
    text-overflow: ellipsis;
`;

const HomeHeader: FC<HomeHeaderProps> = ({
    title,
    name,
}) => {
    return (
        <HeaderContainer>
            <HeaderContent>
                <LogoWrapper>
                    <LogoImage
                        src={Logo}
                        alt="Hành chính công Ngãi Giao"
                    />
                </LogoWrapper>

                <TextContainer>
                    <Title>{title}</Title>

                    <OrganizationName>
                        {name}
                    </OrganizationName>
                </TextContainer>
            </HeaderContent>
        </HeaderContainer>
    );
};

export default HomeHeader;