import {
    ChevronRight,
    FileSearch,
    Globe2,
    RotateCw,
    Search,
    TriangleAlert,
    X,
} from "lucide-react";
import React, { useDeferredValue, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { openWebview } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";

import { ProcedureSummary, useProcedures } from "@api/procedures";
import PageLayout from "@components/layout/PageLayout";
import { normalizeSearchText } from "@utils/search";

const WEBSITE_CATALOG_URL = "https://hccngaigiao.vn/services";
const UNCATEGORIZED = "Khác";

// Giữ bộ lọc khi người dùng xem chi tiết rồi quay lại (trang bị remount)
const savedFilters = { query: "", field: null as string | null };

type IndexedProcedure = ProcedureSummary & { searchText: string };

const ProcedureRow = React.memo<{
    procedure: ProcedureSummary;
    onOpen: (id: string) => void;
}>(({ procedure, onOpen }) => (
    <button
        type="button"
        onClick={() => onOpen(procedure.id)}
        className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm active:bg-gray-50"
    >
        <div className="min-w-0 flex-1">
            <div className="line-clamp-3 text-sm font-bold leading-5 text-gray-900">
                {procedure.title}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                {procedure.procedureCode && (
                    <span className="font-semibold text-blue-600">
                        {procedure.procedureCode}
                    </span>
                )}
                <span>{procedure.field ?? UNCATEGORIZED}</span>
            </div>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
    </button>
));

const RowSkeleton: React.FC = () => (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="h-4 w-11/12 rounded bg-gray-100" />
        <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
        <div className="mt-3 h-3 w-1/3 rounded bg-gray-100" />
    </div>
);

const ProcedureCatalogPage: React.FC = () => {
    const navigate = useNavigate();
    const { openSnackbar } = useSnackbar();
    const { data, error, loading, retry } = useProcedures();

    const [query, setQuery] = useState(savedFilters.query);
    const [field, setField] = useState<string | null>(savedFilters.field);
    const deferredQuery = useDeferredValue(query);

    const indexed = useMemo<IndexedProcedure[]>(
        () =>
            (data ?? []).map(procedure => ({
                ...procedure,
                searchText: normalizeSearchText(
                    [procedure.title, procedure.procedureCode, procedure.field]
                        .filter(Boolean)
                        .join(" "),
                ),
            })),
        [data],
    );

    // Lĩnh vực sắp theo số thủ tục giảm dần
    const fields = useMemo(() => {
        const counts = new Map<string, number>();

        indexed.forEach(procedure => {
            const name = procedure.field ?? UNCATEGORIZED;
            counts.set(name, (counts.get(name) ?? 0) + 1);
        });

        return Array.from(counts.entries()).sort(
            (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "vi"),
        );
    }, [indexed]);

    const results = useMemo(() => {
        const keywords = normalizeSearchText(deferredQuery)
            .split(" ")
            .filter(Boolean);

        return indexed.filter(
            procedure =>
                (!field || (procedure.field ?? UNCATEGORIZED) === field) &&
                keywords.every(keyword =>
                    procedure.searchText.includes(keyword),
                ),
        );
    }, [indexed, deferredQuery, field]);

    const updateQuery = (value: string) => {
        savedFilters.query = value;
        setQuery(value);
    };

    const updateField = (value: string | null) => {
        savedFilters.field = value;
        setField(value);
    };

    const openDetail = React.useCallback(
        (id: string) => navigate(`/procedures/${encodeURIComponent(id)}`),
        [navigate],
    );

    const openWebsite = async () => {
        try {
            await openWebview({
                url: WEBSITE_CATALOG_URL,
                config: { style: "normal" },
            });
        } catch {
            openSnackbar({
                text: "Không thể mở website. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        }
    };

    let content: React.ReactNode;

    if (loading) {
        content = (
            <section className="space-y-3">
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
            </section>
        );
    } else if (error) {
        content = (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <TriangleAlert className="h-6 w-6" />
                </div>

                <h3 className="mb-0 mt-3 text-sm font-bold text-gray-900">
                    Không tải được danh mục thủ tục
                </h3>

                <p className="mb-0 mt-1 text-sm leading-5 text-gray-500">
                    {error}
                </p>

                <div className="mt-4 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={retry}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white active:bg-blue-700"
                    >
                        <RotateCw className="h-4 w-4" />
                        Thử lại
                    </button>

                    <button
                        type="button"
                        onClick={() => openWebsite()}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 active:bg-gray-50"
                    >
                        <Globe2 className="h-4 w-4" />
                        Xem trên website
                    </button>
                </div>
            </section>
        );
    } else if (results.length === 0) {
        content = (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                    <FileSearch className="h-6 w-6" />
                </div>

                <h3 className="mb-0 mt-3 text-sm font-bold text-gray-900">
                    Không tìm thấy thủ tục phù hợp
                </h3>

                <p className="mb-0 mt-1 text-sm leading-5 text-gray-500">
                    Thử từ khoá khác hoặc chọn &quot;Tất cả&quot; lĩnh vực.
                </p>
            </section>
        );
    } else {
        content = (
            <section className="space-y-3">
                {results.map(procedure => (
                    <ProcedureRow
                        key={procedure.id}
                        procedure={procedure}
                        onOpen={openDetail}
                    />
                ))}
            </section>
        );
    }

    return (
        <PageLayout
            className="bg-gray-50"
            name="procedure-catalog"
            title="Tra cứu thủ tục"
        >
            <main className="px-4 pb-8 pt-4">
                <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                        <FileSearch className="h-6 w-6" />
                    </div>

                    <h2 className="mt-4 text-xl font-bold leading-7">
                        Tra cứu thủ tục hành chính
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-white/90">
                        {data
                            ? `${data.length} thủ tục, đồng bộ từ Cổng Dịch vụ công quốc gia.`
                            : "Danh mục thủ tục đồng bộ từ Cổng Dịch vụ công quốc gia."}
                    </p>
                </section>

                <div className="relative mt-4">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                        type="search"
                        value={query}
                        onChange={event => updateQuery(event.target.value)}
                        placeholder="Tên hoặc mã thủ tục, ví dụ: khai sinh"
                        aria-label="Tìm thủ tục"
                        className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-400"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => updateQuery("")}
                            aria-label="Xoá từ khoá"
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {fields.length > 0 && (
                    <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
                        <button
                            type="button"
                            onClick={() => updateField(null)}
                            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                field === null
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-gray-200 bg-white text-gray-600"
                            }`}
                        >
                            Tất cả ({indexed.length})
                        </button>

                        {fields.map(([name, total]) => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => updateField(name)}
                                className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                    field === name
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-gray-200 bg-white text-gray-600"
                                }`}
                            >
                                {name} ({total})
                            </button>
                        ))}
                    </div>
                )}

                {!loading && !error && (
                    <div className="mb-3 mt-4 text-sm text-gray-500">
                        Tìm thấy{" "}
                        <span className="font-bold text-gray-900">
                            {results.length}
                        </span>{" "}
                        thủ tục
                    </div>
                )}

                <div className={loading || error ? "mt-4" : undefined}>
                    {content}
                </div>
            </main>
        </PageLayout>
    );
};

export default ProcedureCatalogPage;

export { ProcedureCatalogPage };
