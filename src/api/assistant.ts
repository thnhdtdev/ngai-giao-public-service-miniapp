import { HccApiError, hccPost } from "./hccClient";

// Giới hạn của backend (assistant.routes.ts): message ≤ 2000 ký tự,
// history ≤ 8 lượt, mỗi lượt ≤ 2000 ký tự.
export const ASSISTANT_MESSAGE_MAX_LENGTH = 2000;
const HISTORY_MAX_TURNS = 8;

// Backend gọi embedding + Gemini (timeout 30s), cộng thêm độ trễ mạng.
const ASSISTANT_TIMEOUT_MS = 45000;

export type AssistantTurn = {
    role: "user" | "assistant";
    content: string;
};

export type AssistantCitation = {
    id: string;
    title: string;
    sourceUrl: string;
    procedureCode: string | null;
};

export type AssistantReply = {
    answer: string;
    citations: AssistantCitation[];
};

export const askAssistant = (
    message: string,
    history: AssistantTurn[],
    signal?: AbortSignal,
): Promise<AssistantReply> =>
    hccPost<AssistantReply>(
        "assistant/chat",
        {
            message: message.trim().slice(0, ASSISTANT_MESSAGE_MAX_LENGTH),
            history: history
                .map(({ role, content }) => ({
                    role,
                    content: content
                        .trim()
                        .slice(0, ASSISTANT_MESSAGE_MAX_LENGTH),
                }))
                .filter(({ content }) => content.length > 0)
                .slice(-HISTORY_MAX_TURNS),
        },
        { signal, timeoutMs: ASSISTANT_TIMEOUT_MS },
    );

/** Lỗi do trợ lý chưa được bật trên máy chủ, thử lại cũng không có tác dụng. */
export const isAssistantUnavailable = (error: unknown) =>
    error instanceof HccApiError && error.code === "AI_NOT_CONFIGURED";

// Backend trả message tiếng Anh nên đổi sang thông báo tiếng Việt theo mã lỗi.
export const toAssistantErrorMessage = (error: unknown): string => {
    if (!(error instanceof HccApiError)) {
        return "Đã có lỗi xảy ra. Vui lòng thử lại.";
    }

    if (error.code === "AI_NOT_CONFIGURED") {
        return "Trợ lý AI đang tạm ngưng để bảo trì. Bạn vui lòng thử lại sau hoặc hỏi trực tiếp cán bộ Bộ phận Một cửa.";
    }

    if (
        error.code === "AI_PROVIDER_ERROR" ||
        error.code === "AI_INVALID_RESPONSE"
    ) {
        return "Trợ lý đang bận, chưa trả lời được. Vui lòng thử lại sau ít phút.";
    }

    if (error.status === 429) {
        return "Bạn gửi câu hỏi hơi nhanh. Vui lòng đợi một chút rồi thử lại.";
    }

    if (error.status === 400) {
        return "Câu hỏi chưa hợp lệ. Vui lòng nhập lại ngắn gọn hơn.";
    }

    if (error.status >= 500) {
        return "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";
    }

    // Lỗi mạng/timeout của hccClient đã là tiếng Việt
    return error.status === 0
        ? error.message
        : "Đã có lỗi xảy ra. Vui lòng thử lại.";
};
