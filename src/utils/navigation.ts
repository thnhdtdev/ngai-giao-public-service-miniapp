import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const canGoBack = () => {
    const state = window.history.state as { idx?: number } | null;

    return (state?.idx ?? 0) > 0;
};

export const useGoBack = () => {
    const navigate = useNavigate();

    return useCallback(() => {
        if (canGoBack()) {
            navigate(-1);
            return;
        }

        navigate("/", { replace: true });
    }, [navigate]);
};
