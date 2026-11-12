import { useCallback, useEffect, useState } from "react";

import { HccApiError, hccGet } from "./hccClient";

// Giới hạn tối đa của backend cho pageSize
const PAGE_SIZE = 100;
const DETAIL_CACHE_LIMIT = 20;

export type ProcedureSummary = {
    id: string;
    procedureCode: string | null;
    title: string;
    field: string | null;
    agency: string | null;
    sourceUrl: string | null;
};

type ProcedurePage = {
    items: ProcedureSummary[];
    pagination: { page: number; totalPages: number; total: number };
};

type PortalFee = { value: string; currency: string; description: string };

type PortalComponent = { name: string; required: boolean | null };

export type ProcedureDetail = ProcedureSummary & {
    submitUrl: string | null;
    processingTime: string | null;
    fee: string | null;
    portalData: unknown;
    structuredDetails: {
        executionSteps: { name: string; description: string }[];
        executionCases: {
            name: string;
            profileComponents: PortalComponent[];
        }[];
        cases: {
            name: string;
            code: string;
            processingTime: string;
            processingTimeUnit: string;
            profileComponents: PortalComponent[];
        }[];
        executionMethods: {
            submissionMethod: string;
            processingTime: string;
            processingTimeUnit: string;
            description: string;
            fees: PortalFee[];
        }[];
        legalBases: { name: string; code: string }[];
        results: { name: string; code: string }[];
        requirementsAndConditions: string | null;
        note: string | null;
    };
};

const getProcedurePage = (page: number) =>
    hccGet<ProcedurePage>("procedures", {
        params: { page, pageSize: PAGE_SIZE },
    });

let cachedProcedures: ProcedureSummary[] | undefined;
let pendingProcedures: Promise<ProcedureSummary[]> | undefined;

/**
 * Tải toàn bộ danh mục (≈374 thủ tục, 4 trang) để tìm kiếm không dấu
 * và lọc theo lĩnh vực ngay trên máy, giống website. API search của
 * backend phân biệt dấu nên không dùng.
 */
export const loadAllProcedures = (): Promise<ProcedureSummary[]> => {
    if (cachedProcedures) {
        return Promise.resolve(cachedProcedures);
    }

    if (!pendingProcedures) {
        pendingProcedures = getProcedurePage(1)
            .then(async firstPage => {
                const restPages = await Promise.all(
                    Array.from(
                        {
                            length: Math.max(
                                0,
                                firstPage.pagination.totalPages - 1,
                            ),
                        },
                        (_, index) => getProcedurePage(index + 2),
                    ),
                );
                const byId = new Map<string, ProcedureSummary>();

                [firstPage, ...restPages].forEach(({ items }) => {
                    items.forEach(item => byId.set(item.id, item));
                });

                cachedProcedures = Array.from(byId.values());
                return cachedProcedures;
            })
            .finally(() => {
                pendingProcedures = undefined;
            });
    }

    return pendingProcedures;
};

const detailCache = new Map<string, ProcedureDetail>();

const rememberDetail = (detail: ProcedureDetail) => {
    detailCache.delete(detail.id);
    detailCache.set(detail.id, detail);

    if (detailCache.size > DETAIL_CACHE_LIMIT) {
        const oldestId = detailCache.keys().next().value;

        if (oldestId !== undefined) {
            detailCache.delete(oldestId);
        }
    }
};

const toErrorMessage = (error: unknown): string =>
    error instanceof HccApiError
        ? error.message
        : "Đã có lỗi xảy ra. Vui lòng thử lại.";

type AsyncState<T> = {
    data?: T;
    error?: string;
    loading: boolean;
};

export const useProcedures = () => {
    const [state, setState] = useState<AsyncState<ProcedureSummary[]>>(() =>
        cachedProcedures
            ? { data: cachedProcedures, loading: false }
            : { loading: true },
    );
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;

        setState(current => ({ ...current, loading: !current.data }));

        loadAllProcedures()
            .then(data => {
                if (active) {
                    setState({ data, loading: false });
                }
            })
            .catch(error => {
                if (active) {
                    setState({ error: toErrorMessage(error), loading: false });
                }
            });

        return () => {
            active = false;
        };
    }, [attempt]);

    const retry = useCallback(() => setAttempt(value => value + 1), []);

    return { ...state, retry };
};

export const useProcedureDetail = (id?: string) => {
    const [state, setState] = useState<AsyncState<ProcedureDetail>>(() => {
        const cached = id ? detailCache.get(id) : undefined;

        return cached ? { data: cached, loading: false } : { loading: true };
    });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!id) {
            setState({ error: "Không tìm thấy thủ tục", loading: false });
            return undefined;
        }

        const cached = detailCache.get(id);

        if (cached) {
            setState({ data: cached, loading: false });
            return undefined;
        }

        const controller = new AbortController();

        setState({ loading: true });

        hccGet<ProcedureDetail>(`procedures/${encodeURIComponent(id)}`, {
            signal: controller.signal,
        })
            .then(detail => {
                rememberDetail(detail);
                setState({ data: detail, loading: false });
            })
            .catch(error => {
                if (controller.signal.aborted) {
                    return;
                }

                setState({
                    error:
                        error instanceof HccApiError && error.status === 404
                            ? "Không tìm thấy thủ tục"
                            : toErrorMessage(error),
                    loading: false,
                });
            });

        return () => controller.abort();
    }, [id, attempt]);

    const retry = useCallback(() => setAttempt(value => value + 1), []);

    return { ...state, retry };
};
