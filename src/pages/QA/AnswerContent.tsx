import React, { useMemo } from "react";

// Hiển thị Markdown cơ bản mà Gemini hay trả về (đoạn văn, gạch đầu dòng,
// danh sách đánh số, tiêu đề, **đậm**, *nghiêng*) và nhãn nguồn [1], [2].
// Dựng React element trực tiếp, không dùng innerHTML.

type InlineToken =
    | { key: string; type: "text"; value: string }
    | { key: string; type: "bold" | "italic"; value: string }
    | { key: string; type: "citation"; numbers: number[] };

type Block =
    | { key: string; type: "paragraph"; text: string }
    | { key: string; type: "heading"; text: string }
    | {
          key: string;
          type: "item";
          marker: string;
          indent: number;
          text: string;
      };

const BULLET_PATTERN = /^(\s*)[-*•+]\s+(.*)$/;
const ORDERED_PATTERN = /^(\s*)(\d+)[.)]\s+(.*)$/;
const HEADING_PATTERN = /^#{1,6}\s+(.*)$/;
const INLINE_PATTERN =
    /(\*\*[^*]+?\*\*|\[\d+(?:\s*[,;–-]\s*\d+)*\]|\*[^*\s][^*]*?\*)/g;
const CITATION_WITH_SPACE_PATTERN = /\s*\[(\d+(?:\s*[,;–-]\s*\d+)*)\]/g;

// Gemini thụt mục con 2–4 dấu cách mỗi cấp
const indentLevel = (spaces: string) =>
    spaces.length < 2
        ? 0
        : Math.min(2, Math.max(1, Math.floor(spaces.length / 4)));

/** Bỏ nhãn [n] không khớp nguồn nào, kèm khoảng trắng phía trước. */
const stripUnknownCitations = (text: string, citationCount: number) =>
    text.replace(CITATION_WITH_SPACE_PATTERN, (match, numbers: string) =>
        (numbers.match(/\d+/g) ?? [])
            .map(Number)
            .some(number => number >= 1 && number <= citationCount)
            ? match
            : "",
    );

const parseBlocks = (text: string): Block[] => {
    const blocks: Block[] = [];
    let paragraph: string[] = [];

    const flushParagraph = () => {
        if (paragraph.length > 0) {
            blocks.push({
                key: `b${blocks.length}`,
                type: "paragraph",
                text: paragraph.join(" "),
            });
            paragraph = [];
        }
    };

    text.replace(/\r\n?/g, "\n")
        .split("\n")
        .forEach(rawLine => {
            const line = rawLine.trimEnd();

            if (!line.trim()) {
                flushParagraph();
                return;
            }

            const heading = line.match(HEADING_PATTERN);

            if (heading) {
                flushParagraph();
                blocks.push({
                    key: `b${blocks.length}`,
                    type: "heading",
                    text: heading[1],
                });
                return;
            }

            const bullet = line.match(BULLET_PATTERN);
            const ordered = bullet ? null : line.match(ORDERED_PATTERN);

            if (bullet || ordered) {
                flushParagraph();
                blocks.push({
                    key: `b${blocks.length}`,
                    type: "item",
                    marker: ordered ? `${ordered[2]}.` : "•",
                    indent: indentLevel((bullet ?? ordered)?.[1] ?? ""),
                    text: (bullet ? bullet[2] : ordered?.[3]) ?? "",
                });
                return;
            }

            const last = blocks[blocks.length - 1];

            // Dòng thụt lề ngay sau một mục là phần tiếp theo của mục đó
            if (
                paragraph.length === 0 &&
                last?.type === "item" &&
                /^\s/.test(line)
            ) {
                last.text = `${last.text} ${line.trim()}`;
                return;
            }

            paragraph.push(line.trim());
        });

    flushParagraph();

    return blocks;
};

const parseInline = (text: string): InlineToken[] =>
    text
        .split(INLINE_PATTERN)
        .filter(Boolean)
        .map((part, index): InlineToken => {
            const key = `t${index}`;

            if (
                part.startsWith("**") &&
                part.endsWith("**") &&
                part.length > 4
            ) {
                return { key, type: "bold", value: part.slice(2, -2) };
            }

            if (/^\[\d/.test(part)) {
                return {
                    key,
                    type: "citation",
                    numbers: (part.match(/\d+/g) ?? []).map(Number),
                };
            }

            if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
                return { key, type: "italic", value: part.slice(1, -1) };
            }

            return { key, type: "text", value: part };
        });

type InlineProps = {
    text: string;
    citationCount: number;
    onCitation: (index: number) => void;
};

const Inline: React.FC<InlineProps> = ({ text, citationCount, onCitation }) => (
    <>
        {parseInline(stripUnknownCitations(text, citationCount)).map(token => {
            if (token.type === "bold") {
                return (
                    <strong
                        className="font-semibold text-gray-900"
                        key={token.key}
                    >
                        {token.value}
                    </strong>
                );
            }

            if (token.type === "italic") {
                return <em key={token.key}>{token.value}</em>;
            }

            if (token.type === "citation") {
                const valid = token.numbers.filter(
                    number => number >= 1 && number <= citationCount,
                );

                // Nhãn không khớp nguồn nào thì bỏ, tránh nút bấm không có đích
                if (valid.length === 0) {
                    return null;
                }

                return (
                    <span className="whitespace-nowrap" key={token.key}>
                        {valid.map(number => (
                            <button
                                aria-label={`Mở nguồn ${number}`}
                                className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-md border-0 bg-blue-100 px-1 align-text-top text-[11px] font-bold leading-none text-blue-700 active:bg-blue-200"
                                key={number}
                                type="button"
                                onClick={() => onCitation(number - 1)}
                            >
                                {number}
                            </button>
                        ))}
                    </span>
                );
            }

            return (
                <React.Fragment key={token.key}>{token.value}</React.Fragment>
            );
        })}
    </>
);

type AnswerContentProps = {
    text: string;
    citationCount: number;
    onCitation: (index: number) => void;
};

const AnswerContent: React.FC<AnswerContentProps> = ({
    text,
    citationCount,
    onCitation,
}) => {
    const blocks = useMemo(() => parseBlocks(text), [text]);

    return (
        <div className="space-y-2 text-sm leading-6 text-gray-800">
            {blocks.map(block => {
                const content = (
                    <Inline
                        citationCount={citationCount}
                        text={block.text}
                        onCitation={onCitation}
                    />
                );

                if (block.type === "heading") {
                    return (
                        <p
                            className="pt-1 font-bold text-gray-900"
                            key={block.key}
                        >
                            {content}
                        </p>
                    );
                }

                if (block.type === "item") {
                    return (
                        <div
                            className="flex gap-2"
                            key={block.key}
                            style={{ paddingLeft: `${block.indent}rem` }}
                        >
                            <span className="w-4 shrink-0 text-right font-semibold text-blue-600">
                                {block.marker}
                            </span>
                            <span className="min-w-0 flex-1">{content}</span>
                        </div>
                    );
                }

                return (
                    <p className="m-0" key={block.key}>
                        {content}
                    </p>
                );
            })}
        </div>
    );
};

export default AnswerContent;
