import {
    AlertCircle,
    ArrowUp,
    BookOpenText,
    MessageCircle,
    RotateCcw,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { openChat, openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

import {
    ASSISTANT_MESSAGE_MAX_LENGTH,
    AssistantCitation,
} from "@api/assistant";
import { loadAllProcedures } from "@api/procedures";
import PageLayout from "@components/layout/PageLayout";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";

import AnswerContent from "./AnswerContent";
import {
    ChatExchange,
    resetConversation,
    retryQuestion,
    sendQuestion,
    useChat,
} from "./chatStore";

const PAGE_TITLE = "Trợ lý hỏi đáp";
const COMPOSER_MAX_HEIGHT_PX = 120;
const COUNTER_THRESHOLD = ASSISTANT_MESSAGE_MAX_LENGTH - 200;
// Chừa chỗ cho header cố định khi cuộn tới đầu câu trả lời
const ANSWER_SCROLL_MARGIN =
    "calc(3.75rem + var(--zaui-safe-area-inset-top, 0px))";

const SUGGESTED_QUESTIONS = [
    "Đăng ký khai sinh cần những giấy tờ gì?",
    "Chứng thực bản sao từ bản chính cần mang theo gì?",
    "Đăng ký kết hôn mất bao lâu, có mất phí không?",
    "Xin giấy xác nhận tình trạng hôn nhân cần hồ sơ gì?",
];

const { oaId, defaultSupportMessage } = NGAI_GIAO_ORGANIZATION.zalo;

const useOpenSupportChat = () => {
    const { openSnackbar } = useSnackbar();

    return useCallback(async () => {
        try {
            await openChat({
                type: "oa",
                id: oaId,
                message: defaultSupportMessage,
            });
        } catch {
            openSnackbar({
                text: "Không thể mở kênh hỗ trợ lúc này.",
                type: "error",
                duration: 3000,
            });
        }
    }, [openSnackbar]);
};

/** Mở nguồn trích dẫn: ưu tiên màn chi tiết thủ tục trong app. */
const useOpenCitation = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();

    return useCallback(
        async (citation: AssistantCitation) => {
            const procedures = await loadAllProcedures().catch(() => undefined);
            const match = procedures?.find(
                procedure =>
                    (citation.procedureCode &&
                        procedure.procedureCode === citation.procedureCode) ||
                    procedure.sourceUrl === citation.sourceUrl,
            );

            if (match) {
                navigate(`/procedures/${encodeURIComponent(match.id)}`);
                return;
            }

            try {
                await openWebview({
                    url: citation.sourceUrl,
                    config: { style: "normal" },
                });
            } catch {
                openSnackbar({
                    text: "Không thể mở nguồn tài liệu. Vui lòng thử lại.",
                    type: "error",
                    duration: 3000,
                });
            }
        },
        [navigate, openSnackbar],
    );
};

const SupportButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 active:bg-blue-100"
        type="button"
        onClick={onClick}
    >
        <MessageCircle className="h-4 w-4" />
        Hỏi cán bộ qua Zalo
    </button>
);

const AssistantAvatar: React.FC = () => (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
        <Sparkles className="h-4 w-4" />
    </span>
);

const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" />
        </span>
        Đang tra cứu tài liệu…
    </div>
);

type ExchangeViewProps = {
    exchange: ChatExchange;
    onCitation: (citation: AssistantCitation) => void;
    onSupport: () => void;
};

const ExchangeView: React.FC<ExchangeViewProps> = ({
    exchange,
    onCitation,
    onSupport,
}) => {
    const citations = exchange.reply?.citations ?? [];

    return (
        <article className="space-y-3">
            <div className="flex justify-end pl-10">
                <p className="m-0 whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-blue-600 px-4 py-2.5 text-sm leading-6 text-white shadow-sm">
                    {exchange.question}
                </p>
            </div>

            <div
                className="flex items-start gap-2 pr-2"
                data-answer={exchange.id}
                style={{ scrollMarginTop: ANSWER_SCROLL_MARGIN }}
            >
                <AssistantAvatar />

                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm">
                    {exchange.status === "pending" && <TypingIndicator />}

                    {exchange.status === "error" && (
                        <>
                            <div className="flex items-start gap-2 text-sm leading-6 text-gray-700">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                                <span>{exchange.error}</span>
                            </div>

                            {!exchange.unavailable && (
                                <button
                                    className="mt-3 flex items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold text-blue-600 active:opacity-70"
                                    type="button"
                                    onClick={() => retryQuestion(exchange.id)}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Thử lại
                                </button>
                            )}

                            <SupportButton onClick={onSupport} />
                        </>
                    )}

                    {exchange.status === "done" && exchange.reply && (
                        <>
                            <AnswerContent
                                citationCount={citations.length}
                                text={exchange.reply.answer}
                                onCitation={index =>
                                    onCitation(citations[index])
                                }
                            />

                            {citations.length > 0 ? (
                                <div className="mt-3 border-t border-gray-100 pt-3">
                                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        <BookOpenText className="h-3.5 w-3.5" />
                                        Nguồn tham khảo
                                    </div>

                                    <ol className="m-0 list-none space-y-1.5 p-0">
                                        {citations.map((citation, index) => (
                                            <li key={citation.id}>
                                                <button
                                                    className="flex w-full items-start gap-2 rounded-lg border-0 bg-gray-50 p-2 text-left active:bg-gray-100"
                                                    type="button"
                                                    onClick={() =>
                                                        onCitation(citation)
                                                    }
                                                >
                                                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-blue-100 px-1 text-[11px] font-bold text-blue-700">
                                                        {index + 1}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="line-clamp-2 block text-xs font-medium leading-5 text-gray-800">
                                                            {citation.title}
                                                        </span>
                                                        {citation.procedureCode && (
                                                            <span className="block text-[11px] leading-4 text-gray-500">
                                                                Mã thủ tục:{" "}
                                                                {
                                                                    citation.procedureCode
                                                                }
                                                            </span>
                                                        )}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            ) : (
                                // Không có nguồn = trợ lý không tìm thấy căn cứ
                                <SupportButton onClick={onSupport} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </article>
    );
};

const Welcome: React.FC<{ onSuggestion: (question: string) => void }> = ({
    onSuggestion,
}) => (
    <>
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                <Sparkles className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-xl font-bold leading-7">
                Bạn cần hỏi về thủ tục nào?
            </h2>

            <p className="mt-2 text-sm leading-5 text-blue-50">
                Đặt câu hỏi bằng ngôn ngữ tự nhiên. Trợ lý trả lời dựa trên tài
                liệu thủ tục hành chính chính thức và ghi rõ nguồn.
            </p>
        </section>

        <h3 className="mb-3 mt-6 text-base font-bold text-gray-900">
            Câu hỏi gợi ý
        </h3>

        <div className="space-y-2">
            {SUGGESTED_QUESTIONS.map(question => (
                <button
                    className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-left text-sm font-medium leading-5 text-gray-800 shadow-sm active:bg-gray-50"
                    key={question}
                    type="button"
                    onClick={() => onSuggestion(question)}
                >
                    <MessageCircle className="h-4 w-4 shrink-0 text-blue-600" />
                    {question}
                </button>
            ))}
        </div>

        <section className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                    <h3 className="text-sm font-bold text-gray-900">
                        Lưu ý khi sử dụng
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-gray-600">
                        Câu trả lời do AI tổng hợp, chỉ mang tính tham khảo. Với
                        hồ sơ cụ thể, vui lòng liên hệ Bộ phận Một cửa để được
                        hướng dẫn chính thức. Không nhập số CCCD, mật khẩu hay
                        thông tin cá nhân khác.
                    </p>
                </div>
            </div>
        </section>
    </>
);

const QA: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [draft, setDraft] = useState("");
    const { exchanges, pending } = useChat();
    const openCitation = useOpenCitation();
    const openSupportChat = useOpenSupportChat();
    const { openSnackbar } = useSnackbar();

    const lastExchange = exchanges[exchanges.length - 1];
    const lastId = lastExchange?.id;
    const lastStatus = lastExchange?.status;
    const hasCitations = exchanges.some(
        exchange => (exchange.reply?.citations.length ?? 0) > 0,
    );

    // Câu hỏi mới: cuộn xuống cuối. Có câu trả lời: cuộn tới đầu câu trả lời
    // để đọc từ trên xuống thay vì rơi vào cuối đoạn dài.
    useEffect(() => {
        const page = pageRef.current;

        if (!page || !lastId) {
            return;
        }

        if (lastStatus === "pending") {
            page.scrollTo({ top: page.scrollHeight, behavior: "smooth" });
            return;
        }

        page.querySelector(`[data-answer="${lastId}"]`)?.scrollIntoView({
            block: "start",
            behavior: "smooth",
        });
    }, [lastId, lastStatus]);

    // Tải sẵn danh mục để bấm nguồn mở chi tiết thủ tục ngay
    useEffect(() => {
        if (hasCitations) {
            loadAllProcedures().catch(() => undefined);
        }
    }, [hasCitations]);

    const resizeInput = () => {
        const input = inputRef.current;

        if (input) {
            input.style.height = "auto";
            input.style.height = `${Math.min(
                input.scrollHeight,
                COMPOSER_MAX_HEIGHT_PX,
            )}px`;
        }
    };

    useEffect(resizeInput, [draft]);

    const submit = (text: string) => {
        if (!text.trim()) {
            return;
        }

        if (pending) {
            openSnackbar({
                text: "Vui lòng đợi trợ lý trả lời câu hỏi trước.",
                type: "info",
                duration: 2500,
            });
            return;
        }

        if (sendQuestion(text)) {
            setDraft("");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Bỏ qua Enter khi bộ gõ tiếng Việt đang ghép chữ (isComposing)
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
        ) {
            event.preventDefault();
            submit(draft);
        }
    };

    const canSend = draft.trim().length > 0 && !pending;

    return (
        <PageLayout
            className="bg-gray-50"
            name="qa"
            ref={pageRef}
            title={PAGE_TITLE}
        >
            <main
                className="px-4 pt-4"
                style={{
                    paddingBottom:
                        "calc(9rem + var(--zaui-safe-area-inset-bottom, 0px))",
                }}
            >
                {exchanges.length === 0 ? (
                    <Welcome onSuggestion={submit} />
                ) : (
                    <>
                        <div className="mb-4 flex justify-end">
                            <button
                                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm active:bg-gray-50"
                                type="button"
                                onClick={resetConversation}
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Cuộc trò chuyện mới
                            </button>
                        </div>

                        <div className="space-y-5">
                            {exchanges.map(exchange => (
                                <ExchangeView
                                    exchange={exchange}
                                    key={exchange.id}
                                    onCitation={openCitation}
                                    onSupport={openSupportChat}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>

            <form
                className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white px-3 pt-2"
                style={{
                    paddingBottom:
                        "calc(0.5rem + var(--zaui-safe-area-inset-bottom, 0px))",
                }}
                onSubmit={event => {
                    event.preventDefault();
                    submit(draft);
                }}
            >
                <div className="flex items-end gap-2">
                    <textarea
                        aria-label="Nhập câu hỏi"
                        className="min-h-11 flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:bg-white"
                        enterKeyHint="send"
                        maxLength={ASSISTANT_MESSAGE_MAX_LENGTH}
                        placeholder="Nhập câu hỏi về thủ tục…"
                        ref={inputRef}
                        rows={1}
                        value={draft}
                        onChange={event => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button
                        aria-label="Gửi câu hỏi"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-blue-600 text-white shadow-sm transition-colors active:bg-blue-700 disabled:bg-gray-300"
                        disabled={!canSend}
                        type="submit"
                    >
                        <ArrowUp className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-3 px-1 text-[11px] leading-4 text-gray-400">
                    <span>AI có thể sai sót, hãy đối chiếu với nguồn.</span>
                    {draft.length > COUNTER_THRESHOLD && (
                        <span className="shrink-0 font-medium text-amber-600">
                            {draft.length}/{ASSISTANT_MESSAGE_MAX_LENGTH}
                        </span>
                    )}
                </div>
            </form>
        </PageLayout>
    );
};

export default QA;

export { QA as QAPage };
