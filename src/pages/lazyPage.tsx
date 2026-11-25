import { LoaderCircle } from "lucide-react";
import React, { ComponentType, lazy, Suspense } from "react";

import PageLayout from "@components/layout/PageLayout";
import RouteErrorBoundary from "@components/RouteErrorBoundary";

type PageModule = { default: ComponentType };

export interface LazyPage {
    (): React.ReactElement;
    preload: () => Promise<void>;
}

export const lazyPage = (
    load: () => Promise<PageModule>,
    title: string,
): LazyPage => {
    let Loaded: ComponentType | undefined;
    let pending: Promise<ComponentType> | undefined;

    const loadOnce = () => {
        pending ??= load().then(
            module => {
                Loaded = module.default;
                return module.default;
            },
            error => {
                pending = undefined;
                throw error;
            },
        );

        return pending;
    };

    const Lazy = lazy(() =>
        loadOnce().then(Component => ({ default: Component })),
    );

    const fallback = (
        <PageLayout className="bg-gray-50" title={title}>
            <div className="flex min-h-64 items-center justify-center text-blue-600">
                <LoaderCircle className="h-7 w-7 animate-spin" />
            </div>
        </PageLayout>
    );

    const Page = () => {
        const Component = Loaded;

        return (
            <RouteErrorBoundary title={title}>
                {Component ? (
                    <Component />
                ) : (
                    <Suspense fallback={fallback}>
                        <Lazy />
                    </Suspense>
                )}
            </RouteErrorBoundary>
        );
    };

    Page.preload = () =>
        loadOnce().then(
            () => undefined,
            () => undefined,
        );

    return Page;
};

export const preloadWhenIdle = (pages: LazyPage[]) => {
    const run = () => {
        pages.reduce<Promise<void>>(
            (chain, page) => chain.then(page.preload),
            Promise.resolve(),
        );
    };

    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 3000 });
    } else {
        setTimeout(run, 1500);
    }
};
