import { useEffect, useState } from "react";

export const useElementWidth = <T extends HTMLElement>() => {
    const [element, setElement] = useState<T | null>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!element) {
            return undefined;
        }

        let frame = 0;
        const measure = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                setWidth(Math.floor(element.getBoundingClientRect().width));
            });
        };

        measure();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", measure);

            return () => {
                cancelAnimationFrame(frame);
                window.removeEventListener("resize", measure);
            };
        }

        const observer = new ResizeObserver(measure);
        observer.observe(element);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [element]);

    return [setElement, width] as const;
};
