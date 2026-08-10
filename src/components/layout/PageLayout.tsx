import React, { ReactNode, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import { Page } from "zmp-ui";
import { PageProps } from "zmp-ui/page";
import tw from "twin.macro";
import DefaultHeader from "./DefaultHeader";

interface PropsType extends PageProps {
    children?: ReactNode;
    title?: string;
    customHeader?: ReactNode;
    name?: string;
    restoreScroll?: boolean;
    restoreScrollBackOnly?: boolean;
    bg?: string;

    noHeader?: boolean;

}

const StyledPage = styled(Page)<{
    $bg?: string;
    $noHeader?: boolean;
}>`
    ${tw`bg-[#EAEBED]`}

    padding-top: ${({ $noHeader }) =>
        $noHeader
            ? "0"
            : "calc(var(--zaui-safe-area-inset-top, 0px) + 48px)"};

    padding-bottom: var(
        --zaui-safe-area-inset-bottom,
        0px
    );

    ${({ $bg }) =>
        $bg
            ? {
                  backgroundColor: $bg,
              }
            : ""}
`;

const PageLayout = React.forwardRef<HTMLDivElement, PropsType>((props, ref) => {
    const {
        title,
        children,
        customHeader,
        restoreScrollBackOnly = true,
        restoreScroll,
        bg,
        noHeader = false,
        ...rest
    } = props;
    const pageRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => pageRef.current as HTMLDivElement);

    return (
        <StyledPage
        {...rest}
        restoreScroll={restoreScroll}
        restoreScrollOnBack={restoreScrollBackOnly}
        ref={pageRef}
        $bg={bg}
        $noHeader={noHeader}
    >
        {!noHeader &&
            (customHeader || (
                <DefaultHeader title={title} back />
            ))}

        {children}
    </StyledPage>
    );
});

export default PageLayout;
