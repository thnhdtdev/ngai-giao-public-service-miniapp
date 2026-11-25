import { Banknote, FileDown, Info, Search, X } from "lucide-react";
import React, { useDeferredValue, useMemo, useState } from "react";
import { openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

import {
    FeeGroup,
    FeeItem,
    FeeLine,
    formatFeeAmount,
    FREE_OF_CHARGE,
    useFeeSchedule,
} from "@content/feeSchedule";
import PageLayout from "@components/layout/PageLayout";
import ShareButton from "@components/ShareButton";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";
import { normalizeSearchText } from "@utils/search";

const PAGE_TITLE = "Phí, lệ phí";
const ALL_GROUPS = "all";

const matches = (line: FeeLine, query: string) =>
    normalizeSearchText(`${line.name} ${line.note ?? ""}`).includes(query);

/** Giữ mục khớp tên; nếu chỉ trường hợp con khớp thì chỉ giữ các con đó. */
const filterGroups = (
    groups: FeeGroup[],
    groupCode: string,
    query: string,
): FeeGroup[] =>
    groups
        .filter(group => groupCode === ALL_GROUPS || group.code === groupCode)
        .map(group => ({
            ...group,
            sections: group.sections
                .map(section => ({
                    ...section,
                    items: query
                        ? section.items.flatMap((item): FeeItem[] => {
                              if (matches(item, query)) {
                                  return [item];
                              }

                              const children = item.children.filter(child =>
                                  matches(child, query),
                              );

                              return children.length
                                  ? [{ ...item, children }]
                                  : [];
                          })
                        : section.items,
                }))
                .filter(section => section.items.length > 0),
        }))
        .filter(group => group.sections.length > 0);

const countLines = (groups: FeeGroup[]) =>
    groups.reduce(
        (total, group) =>
            total +
            group.sections.reduce(
                (sum, section) =>
                    sum +
                    section.items.reduce(
                        (count, item) =>
                            count + Math.max(1, item.children.length),
                        0,
                    ),
                0,
            ),
        0,
    );

const Amount: React.FC<{
    label: string;
    value?: string;
    detail?: string;
}> = ({ label, value, detail }) => {
    if (!value) {
        return null;
    }

    const isFree = value === FREE_OF_CHARGE;

    return (
        <div className="min-w-0 rounded-xl bg-gray-50 px-3 py-2">
            <div className="text-[11px] font-medium text-gray-500">{label}</div>
            <div
                className={`text-sm font-bold leading-5 ${
                    isFree ? "text-emerald-600" : "text-gray-900"
                }`}
            >
                {formatFeeAmount(value)}
            </div>
            {detail && (
                <div className="mt-1 text-[11px] leading-4 text-gray-500">
                    {detail}
                </div>
            )}
        </div>
    );
};

const Amounts: React.FC<{ line: FeeLine }> = ({ line }) =>
    line.direct || line.online ? (
        <div className="mt-2 grid grid-cols-2 items-start gap-2">
            {/* Giữ mức trực tuyến ở cột phải khi không có mức trực tiếp */}
            {line.direct ? (
                <Amount label="Trực tiếp / bưu chính" value={line.direct} />
            ) : (
                <div aria-hidden="true" />
            )}
            <Amount
                detail={line.onlineDetail}
                label="Trực tuyến"
                value={line.online}
            />
        </div>
    ) : null;

const FeeItemCard: React.FC<{ item: FeeItem }> = ({ item }) => (
    <article
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        data-testid="fee-item"
    >
        <h4 className="m-0 text-sm font-bold leading-5 text-gray-900">
            {item.no}. {item.name}
        </h4>

        <Amounts line={item} />

        {item.children.length > 0 && (
            <ul className="m-0 mt-3 list-none space-y-3 border-l-2 border-blue-100 p-0 pl-3">
                {item.children.map(child => (
                    <li key={child.name}>
                        <div className="text-sm font-medium leading-5 text-gray-800">
                            {child.name}
                        </div>
                        <Amounts line={child} />
                        {child.note && (
                            <p className="mb-0 mt-1.5 text-xs leading-4 text-gray-500">
                                {child.note}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        )}

        {item.note && (
            <p className="mb-0 mt-3 flex items-start gap-1.5 text-xs leading-4 text-gray-500">
                <Info className="mt-px h-3.5 w-3.5 shrink-0" />
                {item.note}
            </p>
        )}
    </article>
);

const FeeSchedulePage: React.FC = () => {
    const { openSnackbar } = useSnackbar();
    const { schedule, loading } = useFeeSchedule();
    const [search, setSearch] = useState("");
    const [groupCode, setGroupCode] = useState(ALL_GROUPS);
    const query = normalizeSearchText(useDeferredValue(search));

    const groups = useMemo(
        () => filterGroups(schedule?.groups ?? [], groupCode, query),
        [schedule, groupCode, query],
    );
    const resultCount = useMemo(() => countLines(groups), [groups]);

    const handleOpenPdf = async () => {
        if (!schedule?.pdfUrl) {
            return;
        }

        try {
            await openWebview({
                url: schedule.pdfUrl,
                config: { style: "normal" },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở bảng phí. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    return (
        <PageLayout
            className="bg-gray-50"
            name="fee-schedule"
            title={PAGE_TITLE}
        >
            <main className="px-4 pb-8 pt-4">
                <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-5 text-white shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                            <Banknote className="h-6 w-6" />
                        </div>

                        <ShareButton
                            className="h-9 rounded-full border border-white/25 bg-white/15 px-3 text-xs font-semibold text-white active:bg-white/25"
                            description={
                                NGAI_GIAO_ORGANIZATION.organization.fullName
                            }
                            label="Chia sẻ"
                            path="/public-notices/fees"
                            title={
                                schedule?.title ??
                                "Bảng phí, lệ phí thủ tục hành chính"
                            }
                        />
                    </div>
                    <h2 className="mt-4 text-lg font-bold leading-6">
                        {schedule?.title ??
                            "Bảng niêm yết công khai phí, lệ phí giải quyết TTHC"}
                    </h2>
                    <p className="mt-1 text-sm leading-5 text-white/90">
                        {NGAI_GIAO_ORGANIZATION.organization.fullName}
                    </p>
                </section>

                <div className="relative mt-4">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        aria-label="Tìm mục phí"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-10 text-base text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Tìm: khai sinh, chứng thực, kết hôn…"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                    {search && (
                        <button
                            aria-label="Xoá tìm kiếm"
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-gray-400 active:bg-gray-100"
                            type="button"
                            onClick={() => setSearch("")}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {schedule && schedule.groups.length > 1 && (
                    <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
                        {[
                            { code: ALL_GROUPS, title: "Tất cả" },
                            ...schedule.groups,
                        ].map(group => {
                            const active = group.code === groupCode;

                            return (
                                <button
                                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                        active
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "border-gray-200 bg-white text-gray-600"
                                    }`}
                                    key={group.code}
                                    type="button"
                                    onClick={() => setGroupCode(group.code)}
                                >
                                    {group.title}
                                </button>
                            );
                        })}
                    </div>
                )}

                {loading && (
                    <div className="mt-4 space-y-3">
                        {[0, 1, 2].map(item => (
                            <div
                                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
                                key={item}
                            />
                        ))}
                    </div>
                )}

                {!loading && query && (
                    <p className="mb-0 mt-3 text-xs text-gray-500">
                        {resultCount > 0
                            ? `Tìm thấy ${resultCount} mục phí`
                            : "Không tìm thấy mục phí phù hợp."}
                    </p>
                )}

                {!loading && !schedule && (
                    <p className="mt-4 rounded-2xl bg-white p-5 text-center text-sm text-gray-600 shadow-sm">
                        Bảng phí đang được cập nhật.
                    </p>
                )}

                {groups.map(group => (
                    <section className="mt-6" key={group.code}>
                        <h3 className="m-0 text-base font-bold text-gray-900">
                            {group.code}. {group.title}
                        </h3>
                        {group.note && (
                            <p className="mb-0 mt-1 text-xs leading-4 text-gray-500">
                                Căn cứ: {group.note}
                            </p>
                        )}

                        {group.sections.map(section => (
                            <div
                                className="mt-3"
                                key={`${group.code}-${section.code ?? "main"}`}
                            >
                                {section.title && (
                                    <h4 className="mb-2 mt-0 text-xs font-bold uppercase leading-4 tracking-wide text-blue-700">
                                        {section.code}. {section.title}
                                    </h4>
                                )}
                                <div className="space-y-3">
                                    {section.items.map(item => (
                                        <FeeItemCard
                                            item={item}
                                            key={`${item.no}-${item.name}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                ))}

                {schedule?.pdfUrl && (
                    <button
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 active:bg-blue-50"
                        type="button"
                        onClick={handleOpenPdf}
                    >
                        <FileDown className="h-4 w-4" />
                        Xem bảng phí gốc (PDF)
                    </button>
                )}
            </main>
        </PageLayout>
    );
};

export default FeeSchedulePage;

export { FeeSchedulePage };
