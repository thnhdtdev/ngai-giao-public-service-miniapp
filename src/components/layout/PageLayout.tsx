import clsx from "clsx";
import React, { ReactNode, useImperativeHandle, useRef } from "react";
import { Page } from "zmp-ui";
import { PageProps } from "zmp-ui/page";
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
    onBackClick?: React.MouseEventHandler;
}

const PageLayout = React.forwardRef<HTMLDivElement, PropsType>((props, ref) => {
    const {
        title,
        children,
        customHeader,
        restoreScrollBackOnly = true,
        restoreScroll,
        bg,
        noHeader = false,
        onBackClick,
        className,
        ...rest
    } = props;
    const pageRef = useRef<HTMLDivElement>(null);
    const hasBackgroundClass = className
        ?.split(/\s+/)
        .some(value => value.startsWith("bg-"));

    useImperativeHandle(ref, () => pageRef.current as HTMLDivElement);

    return (
        <Page
            {...rest}
            className={clsx(
                "pb-safe-bottom",
                noHeader ? "pt-0" : "pt-safe-header",
                !hasBackgroundClass &&
                    (bg === "white" ? "bg-white" : "bg-slate-100"),
                className,
            )}
            restoreScroll={restoreScroll}
            restoreScrollOnBack={restoreScrollBackOnly}
            ref={pageRef}
        >
            {!noHeader &&
                (customHeader || (
                    <DefaultHeader
                        title={title}
                        back
                        onBackClick={onBackClick}
                    />
                ))}
            {children}
        </Page>
    );
});

export default PageLayout;
