import { useSyncExternalStore } from "react";

import {
    AssistantReply,
    AssistantTurn,
    askAssistant,
    isAssistantUnavailable,
    toAssistantErrorMessage,
} from "@api/assistant";

// Lưu cuộc trò chuyện ở module để không mất khi rời trang (AnimationRoutes
// unmount trang cũ), ví dụ khi mở chi tiết thủ tục từ nguồn trích dẫn.
const MAX_EXCHANGES = 30;

export type ChatExchange = {
    id: string;
    question: string;
    status: "pending" | "done" | "error";
    reply?: AssistantReply;
    error?: string;
    /** Trợ lý chưa bật trên máy chủ: ẩn nút "Thử lại". */
    unavailable?: boolean;
};

type ChatState = {
    exchanges: ChatExchange[];
};

let state: ChatState = { exchanges: [] };
let sequence = 0;
let activeController: AbortController | undefined;
const listeners = new Set<() => void>();

const setState = (next: ChatState) => {
    state = next;
    listeners.forEach(listener => listener());
};

const updateExchange = (id: string, patch: Partial<ChatExchange>) => {
    setState({
        exchanges: state.exchanges.map(exchange =>
            exchange.id === id ? { ...exchange, ...patch } : exchange,
        ),
    });
};

const isPending = () =>
    state.exchanges.some(exchange => exchange.status === "pending");

/** Các lượt hỏi - đáp thành công trước `id`, dùng làm ngữ cảnh. */
const historyBefore = (id: string): AssistantTurn[] => {
    const index = state.exchanges.findIndex(exchange => exchange.id === id);

    return state.exchanges
        .slice(0, Math.max(0, index))
        .filter(exchange => exchange.status === "done" && exchange.reply)
        .flatMap(exchange => [
            { role: "user" as const, content: exchange.question },
            {
                role: "assistant" as const,
                content: exchange.reply?.answer ?? "",
            },
        ]);
};

const run = (id: string) => {
    const exchange = state.exchanges.find(item => item.id === id);

    if (!exchange) {
        return;
    }

    const controller = new AbortController();
    activeController = controller;

    askAssistant(exchange.question, historyBefore(id), controller.signal)
        .then(reply => {
            if (!controller.signal.aborted) {
                updateExchange(id, {
                    status: "done",
                    reply,
                    error: undefined,
                    unavailable: undefined,
                });
            }
        })
        .catch(error => {
            if (!controller.signal.aborted) {
                updateExchange(id, {
                    status: "error",
                    error: toAssistantErrorMessage(error),
                    unavailable: isAssistantUnavailable(error),
                });
            }
        })
        .finally(() => {
            if (activeController === controller) {
                activeController = undefined;
            }
        });
};

/** Gửi câu hỏi mới. Trả về `false` nếu đang chờ câu trả lời trước. */
export const sendQuestion = (question: string): boolean => {
    const text = question.trim();

    if (!text || isPending()) {
        return false;
    }

    sequence += 1;
    const id = `q${sequence}`;

    setState({
        exchanges: [
            ...state.exchanges,
            { id, question: text, status: "pending" as const },
        ].slice(-MAX_EXCHANGES),
    });
    run(id);

    return true;
};

export const retryQuestion = (id: string) => {
    if (isPending()) {
        return;
    }

    updateExchange(id, {
        status: "pending",
        error: undefined,
        unavailable: undefined,
    });
    run(id);
};

export const resetConversation = () => {
    activeController?.abort();
    activeController = undefined;
    setState({ exchanges: [] });
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => state;

export const useChat = () => {
    const { exchanges } = useSyncExternalStore(subscribe, getSnapshot);

    return {
        exchanges,
        pending: exchanges.some(exchange => exchange.status === "pending"),
    };
};
